import BaseUI from "./BaseUI";

const DEFAULT_EVENT_NAMES = [
    '_onTouchStart',
    '_onTouchMove',
    '_onTouchEnd',
    '_onTouchCancel',
];

const { ccclass, property } = cc._decorator;

@ccclass
export class UIComponent extends BaseUI {

    // @property(cc.Boolean)
    // public debug = false

    //是否绑定
    private _bindHammer: boolean = false
    //
    private _prefix: string = '_';
    private static _plugins: any[] = [];
    public debugInfo: Object = null;

    __preload() {
        this.bindHammer();
    }

    getOptions() {
        return {
            debug: this.debug
        }
    }

    bindHammer() {
        if (this._bindHammer) {
            return;
        }
        if (!CC_EDITOR) {
            this._bindHammer = true;
        }
        let start = Date.now();
        let options = this.getOptions();

        this.bindComponent(this, options);
        if (this.debugInfo) {
            let duration = Date.now() - start;
            cc.log(`bindComponent ${this.node.name} duration ${duration}`);
        }
    }

    public static registerPlugin(plugins) {
        if (!Array.isArray(plugins)) {
            plugins = [plugins];
        }

        plugins.forEach((plugin) => {
            //插件能不重复
            let idx = UIComponent._plugins.indexOf(plugin);
            if (idx != -1) {
                return;
            }

            //执行插件注册事件
            UIComponent._plugins.push(plugin);
            if (plugin.onRegister) {
                plugin.onRegister();
            }
        });
    }

    /**
     * 获取组件名字
     * @param {cc.Component} component 
     */
    _getComponentName(component: cc.Component): string {
        return component.name.match(/<.*>$/)[0].slice(1, -1);
    }

    /**
     * 绑定组件
     * @param {cc.Component} component  要绑定的组件 
     * @param {Object} options          绑定选项
     */
    public bindComponent(component: cc.Component, options: Object) {
        component.$options = options || {};

        let root: cc.Node = component.node;
        root._components.forEach((nodeComponent) => {
            let name = this._getComponentName(nodeComponent);
            name = `$${name}`;
            root[name] = nodeComponent;
        });

        //绑定根节点触摸事件
        this._bindTouchEvent(root, component, DEFAULT_EVENT_NAMES);
        //绑定所有组件子节点
        this._bindNode(component.node, component);
    }

    /**
     * 绑定事件 toggle
     */
    _bindToggleEvent(node: cc.Node, target: BaseUI) {
        let eventName = this._getToggleEventName(node);
        let toggle: cc.Toggle = node.getComponent(cc.Toggle);
        if (!target[eventName] || !toggle) {
            return;
        }
        let eventHandler = this.getEventHandler(target.node, target.node.name, eventName);
        toggle.checkEvents.push(eventHandler);
        node.on(cc.Node.EventType.TOUCH_END, (event) => {
            this._afterHandleEventByPlugins(node, event, true, true);

        });
    }

    _getToggleEventName(node: cc.Node) {
        let name = node.$eventName || node.name;
        if (name) {
            name = name[this._prefix.length].toUpperCase() + name.slice(this._prefix.length + 1);
        }

        return `_on${name}ToggleEnd`;
    }

    /**
     * 绑定事件 botton
     * @param {cc.Node} node
     */
    _bindTouchEvent(node: cc.Node, target: cc.Component, defaultNames: string[]) {
        //todo: EditBox 组件不能注册触摸事件,在原生上会导致不能被输入
        if (node.getComponent(cc.EditBox)) {
            return;
        }

        const eventNames: string[] = defaultNames || this._getTouchEventName(node, null);
        const eventTypes = [
            cc.Node.EventType.TOUCH_START,
            cc.Node.EventType.TOUCH_MOVE,
            cc.Node.EventType.TOUCH_END,
            cc.Node.EventType.TOUCH_CANCEL,
        ];

        eventNames.forEach((eventName, index) => {
            const tempEvent = target[eventName];
            if (!tempEvent || !node.getComponent(cc.Button)) {
                return;
            }

            node.on(eventTypes[index], (event) => {
                //被禁用的node 节点不响应事件
                let eventNode = event.currentTarget;
                if (eventNode.interactable === false || eventNode.active === false) {
                    return;
                }

                //检查button组件是否有事件处理函数，有则执行插件事件处理
                const button = eventNode.getComponent(cc.Button);
                if (button && button.interactable === false) {
                    return;
                }
                const eventFunc = target[eventName];
                //是否有效事件
                const isValidEvent = eventFunc || (button && button.clickEvents.length);
                if (isValidEvent) {
                    this._beforeHandleEventByPlugins(eventNode, event, !!eventFunc);
                }

                //执行事件函数，获取返回值
                let eventResult;
                if (eventFunc) {
                    eventResult = eventFunc.call(target, eventNode, event);
                    //如果是触摸开始事件，返回fasle，使用节点可穿透
                    if (event.type === cc.Node.EventType.TOUCH_START && eventResult === false) {
                        eventNode._touchListener.setSwallowTouches(false);
                    } else {
                        node._touchListener.setSwallowTouches(true);
                        event.stopPropagation();
                    }
                }

                //检查button组件是否有事件处理函数，有则执行插件事件处理
                if (isValidEvent) {
                    this._afterHandleEventByPlugins(eventNode, event, !!eventFunc, eventResult);
                }
            });
        });

        //绑定长按事件
        this._bindTouchLongEvent(node, target);
    }

    /**
     * 绑定触摸事件
     * @param {cc.Node} node 
     * @param {String} event 
     */
    _getTouchEventName(node: cc.Node, event: string) {
        let name = node.$eventName || node.name;
        if (name) {
            name = name[this._prefix.length].toUpperCase() + name.slice(this._prefix.length + 1);
        }

        if (event) {
            return [`_on${name}${event}`];
        }

        return [
            `_on${name}TouchStart`,
            `_on${name}TouchMove`,
            `_on${name}TouchEnd`,
            `_on${name}TouchCancel`,
        ];
    }

    /**
     * 插件响应节点触摸前事件
     * @param node
     * @param event
     * @private
     */
    _beforeHandleEventByPlugins(node: cc.Node, event: any, hasEventFunc: boolean) {
        UIComponent._plugins.forEach((item) => {
            if (item.onBeforeHandleEvent) {
                item.onBeforeHandleEvent(node, event, hasEventFunc);
            }
        });
    }

    /**
     * 插件响应节点触摸后事件
     * @param node
     * @param event
     * @private
     */
    _afterHandleEventByPlugins(node: cc.Node, event: any, hasEventFunc: boolean, eventResult: any) {
        UIComponent._plugins.forEach((item) => {
            if (item.onAfterHandleEvent) {
                item.onAfterHandleEvent(node, event, hasEventFunc, eventResult);
            }
        });
    }

    /**
     * 绑定长按事件
     * @param {cc.Node} node
     */
    _bindTouchLongEvent(nodeObject: cc.Node, target) {
        const node: cc.Node = nodeObject;
        const eventName = this._getTouchEventName(node, 'TouchLong')[0];
        const touchLong = target[eventName];
        //如果没有事件，返回
        if (!UIComponent.isFunction(touchLong)) {
            return;
        }

        node._touchLongTimer = null;
        node.on(cc.Node.EventType.TOUCH_END, () => {
            if (node._touchLongTimer) {
                clearTimeout(node._touchLongTimer);
                node._touchLongTimer = 0;
                delete node.interactable;
            }
        });

        node.on(cc.Node.EventType.TOUCH_START, (event) => {
            node._touchLongTimer = setTimeout(() => {
                //准备触发touchLong事件
                node.interactable = !!touchLong.call(target, node, event);
                node._touchLongTimer = 0;
            }, node.touchLongTime || 1000);
        });
    }

    /**
     * 递归绑定节点
     * @param {cc.Node} nodeObject 
     * @param {Object} target 
     */
    _bindNode(nodeObject: cc.Node, target: cc.Component) {
        const node = nodeObject;
        let isBindNode = false;
        //绑定组件到自身node节点上
        if (node.name[0] === this._prefix) {
            node._components.forEach((component) => {
                let name = this._getComponentName(component);

                name = `$${name}`;
                if (node[name] && target.$options.debug) {
                    cc.warn(`${name} property is already exists`);
                    return;
                }

                node[name] = component;
                //检查组件 onBind 函数,通知组件,target 对象在绑定自己
                if (UIComponent.isFunction(component.onBind)) {
                    component.onBind(target);
                }

                if (component instanceof UIComponent) {
                    //判定是否将要自行绑定的节点
                    if (!isBindNode && component !== target) {
                        isBindNode = true;
                    }

                    if (!node.active) {
                        component.bindHammer();
                    }
                }
            });
        }

        //执行插件
        let bool = this._checkNodeByPlugins(node, target);
        if (bool || isBindNode) {
            return;
        }

        node.children.forEach((child) => {
            let name = child.name;
            if (name[0] === this._prefix) {
                let index = name.indexOf('$');

                //检查控件别名
                if (index !== -1) {
                    child.$eventName = name.substr(0, index);
                    child.$ = name.substr(index + 1);
                    name = child.$eventName + child.$[0].toUpperCase() + child.$.substr(1);
                    if (!CC_EDITOR) {
                        child.name = name;
                    }
                }

                if (target[name] && target.$options.debug) {
                    cc.warn(`${target.name}.${name} property is already exists`);
                    return;
                }
                this._bindTouchEvent(child, target, null);
                this._bindToggleEvent(child, target);

                target[name] = child;

                //保存绑定的指针
                if (target.$collector) {
                    target.$collector[name] = child;
                }
            } else if (!node[name]) {
                //绑定非前缀子节点
                node[name] = child;
            }

            this._bindNode(child, target);
        });
    }

    /**
     * 拿所有插件去检查node 节点, onCheckNode返回为 false 的,此节点将不被绑定
     * @param node
     * @param target
     * @returns {boolean}
     * @private
     */
    _checkNodeByPlugins(node, target) {
        for (let i = 0; i < UIComponent._plugins.length; i++) {
            let item = UIComponent._plugins[i];
            if (item.onCheckNode && item.onCheckNode(node, target) === false) {
                return true;
            }
        }
        return false;
    }

    /**
     * 类方法
     * @param value 
     */
    public static isFunction(value: string): boolean {
        return typeof value === 'function';
    }

    /**
     * 
    * target(cc.Node) 要运行在哪个脚本的this.node节点
    * component(String) 要运行的component的名称
    * handler(String) 回调函数的名称 
     */
    private getEventHandler(target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        return eventHandler;
        // update (dt) {}
    }
}
