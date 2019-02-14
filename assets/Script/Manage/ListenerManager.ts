


export default class ListenerManager {

    private static _callbacks: object = {};
    private static _contexts: object = {};

    /**
     * 添加监听事件
     * @param event 
     * @param fn 
     * @param context 
     */
    public static on(event: any, fn: Function, context?: any) {
        let callBack = fn;
        /**
         * 默认 context 为 Component 实例
         */
        (context.__instanceId == undefined) && (context.__instanceId = -1)
        if (arguments.length == 3) {
            callBack = function () {
                try {
                    fn.apply(context, arguments);
                } catch (error) {
                    console.log(error);
                }
            }
            callBack.fn = fn;
            callBack.context = context;
            callBack.event = event;
            (ListenerManager._contexts[context.__instanceId] = ListenerManager._contexts[context.__instanceId] || [])
                .push(callBack);
        }
        (ListenerManager._callbacks[event] = ListenerManager._callbacks[event] || [])
            .push(callBack);
        return ListenerManager;
    }

    /**
     * 添加事件，该事件只被触发一次，触发后会被移除
     * @param event 
     * @param fn 
     * @param context 
     */
    public static once(event: any, fn: Function, context: any) {
        let self = this;
        let argsLen = arguments.length;
        function on() {
            self.off(event, on);
            if (argsLen == 3) {
                fn.apply(context, arguments);
            } else {
                fn.apply(this, arguments);
            }
        }
        on.fn = fn;
        this.on(event, fn, context);
        return ListenerManager;
    }

    /**
     * 
     * @param context 
     */
    public static offThis(context: cc.Component) {
        let contexts = ListenerManager._contexts[context.__instanceId] || [];
        let len = contexts.length;
        for (let i = 0; i < len; i++) {
            let callBack = contexts[i];
            this.off(callBack.event, callBack.fn, callBack.context);
        }
        if (ListenerManager._contexts[context.__instanceId]) {
            //删除
            delete ListenerManager._contexts[context.__instanceId];
        }
        return ListenerManager;
    }

    public static off(event: any, fn: Function, context?: any) {
        // all
        if (0 == arguments.length) {
            delete ListenerManager._callbacks;
            ListenerManager._callbacks = {};
            return ListenerManager;
        }

        // specific event
        let callbacks = ListenerManager._callbacks[event];
        if (!callbacks) return ListenerManager;

        // remove all handlers
        if (1 == arguments.length) {
            delete ListenerManager._callbacks[event];
            return ListenerManager;
        }

        // remove specific handler
        let cb;
        for (let i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (arguments.length == 2) {
                if (cb === fn || cb.fn === fn) {
                    callbacks.splice(i, 1);
                    break;
                }
            } else if (arguments.length == 3) {
                if (cb === fn || (cb.fn === fn && cb.context === context)) {
                    callbacks.splice(i, 1);
                    break;
                }
            }
        }
        return ListenerManager
    }

    public static emit(event: any) {
        var args = [].slice.call(arguments, 1),
            callbacks = this._callbacks[event];

        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, args);

            }
        }

        return ListenerManager;
    }
}
