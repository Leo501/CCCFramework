import BaseUI, { UIClass, UIShowType } from "../Utils/UIKiller/BaseUI";
import { resGetPrefab } from "./ResManager";
import { TipMgr } from "./TipManager";
import { isArrayLike } from "mobx";

export enum UILevel {
    AlwayBottom = -3, //如果不想区分太复杂那最底层的UI请使用这个
    Bg = -2, //背景层UI
    AnimationUnderPage = -1, //动画层
    Common = 0, //普通层UI
    AnimationOnPage = 1, // 动画层
    PopUI = 2, //弹出层UI
    Guide = 3, //新手引导层
    Const = 4, //持续存在层UI
    Toast = 5, //对话框层UI
    Forward = 6, //最高UI层用来放置UI特效和模型
    AlwayTop = 7, //如果不想区分太复杂那最上层的UI请使用这个
}

export class UIMgr {
    private static instance: UIMgr = null;
    private uiList: BaseUI[] = [];
    private uiMap: Map<string, BaseUI> = new Map<string, BaseUI>();
    private uiStack = [];
    private uiRoot: cc.Node = null;
    private uiBg: cc.Node = null;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new UIMgr();
        }
        return this.instance;
    }

    constructor() {
        this.uiRoot = cc.find("Canvas/PopUI");
        this.uiBg = cc.find('Bg', this.uiRoot);
    }

    public openUI<T extends BaseUI>(uiClass: UIClass<T>, uiShow: UIShowType, data?: any) {
        let className = uiClass.getClassName();
        let ui = this.getUI(className);
        if (ui) {
            ui.node.active = true;
            this.UIInitAndShow(ui, uiShow, data);
            this.clearUIStackAndSetFirst(ui);
            return;
        }
        this.loadPrefab(uiClass.getUrl()).then((prefab) => {
            if (this.getUI(className)) {
                return null;
            }
            let node = cc.instantiate(prefab);
            this.uiRoot.addChild(node);
            let ui = node.getComponent(uiClass) as BaseUI;
            ui.tag = uiClass;
            this.uiMap.set(className, ui);
            this.UIInitAndShow(ui, uiShow, data);
            this.clearUIStackAndSetFirst(ui);
        }).catch((err) => {
            TipMgr.Instance().create(`加载${className}失败`);
        });
    }

    public closeUI<T extends BaseUI>(uiClass: UIClass<T>, isClear) {
        this.uiStack.pop();
        let className = uiClass.getClassName();
        let ui = this.getUI(className);
        if (isClear) {
            this.uiMap.delete(className);
            ui && ui.node.destroy();
        } else {
            ui && ui.node.removeFromParent();
        }
    }

    public pushUI<T extends BaseUI>(uiClass: UIClass<T>, uiShow: UIShowType, data?: any) {
        let className = uiClass.getClassName();
        let ui = this.getUI(className);
        if (ui) {
            let lastUI = this.uiStack[this.uiStack.length];
            this.hideUI(lastUI);
            ui.node.active = true;
            this.UIInitAndShow(ui, uiShow, data);
            this.uiStack.push(ui);
            return;
        }
        this.loadPrefab(uiClass.getUrl()).then((prefab) => {
            if (this.getUI(className)) {
                return null;
            }
            let node = cc.instantiate(prefab);
            this.uiBg.active = true;
            let lastUI = this.uiStack[this.uiStack.length];
            this.hideUI(lastUI);
            this.uiRoot.addChild(node);
            let ui = node.getComponent(uiClass) as BaseUI;
            ui.tag = uiClass;
            this.UIInitAndShow(ui, uiShow, data);
            this.uiStack.push(ui);
        }).catch((err) => {
            TipMgr.Instance().create("加载Prefab 失败");
        });
    }

    public backUI(isClear = false) {
        let ui = this.uiStack.pop();
        if (isClear) {
            this.uiMap.delete(ui.getClassName());
            ui && ui.node.destroy();
        } else {
            ui && ui.node.removeFromParent();
        }
        ui = this.uiStack[this.uiStack.length - 1];
        ui.node.active = true;
    }

    public clearAllUI() {
        this.uiMap.forEach(ui => {
            ui && ui.node.destroy();
        });
        this.uiMap.clear();
        this.uiStack.length = 0;
    }

    private async loadPrefab(url) {
        let prefab = await resGetPrefab(url);
        return prefab;
    }

    private UIInitAndShow(ui: BaseUI, uiShow: UIShowType, data?: any) {
        ui.node.active = true;
        data && ui.init(data);
        this.uiBg.active = true;
        ui.show(uiShow);
    }

    private getUI<T extends BaseUI>(uiClass: string): BaseUI {
        return this.uiMap.get(uiClass) || null;
    }

    private hideUI(ui: BaseUI) {
        ui && (ui.node.active = false);
    }

    private clearUIStackAndSetFirst<T extends BaseUI>(ui: T) {
        if (this.uiStack.length != 0) {
            this.uiStack.forEach((ui) => {
                ui && ui.node.removeFromParent();
            });
        }
        this.uiStack.length = 0;
        this.uiStack.push(ui);
    }
}

