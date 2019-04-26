import BaseUI, { UIClass, UIShowType, UIHideType } from "../Utils/UIKiller/BaseUI";
import { resGetPrefab } from "./ResManager";
import { TipMgr } from "./TipManager";
import { PoolPlugin } from "../Utils/UIKiller/PoolPlugin";

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
    private uiMap: Map<string, PoolPlugin> = new Map<string, PoolPlugin>();
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
        let ui = this.getUI(uiClass, uiShow, data);
        ui && this.UIInitAndShow(ui, uiShow, data);
    }

    public closeUI<T extends BaseUI>(node: UIClass<T> | cc.Node) {
        if (node instanceof cc.Node) {
            this.putUI((child) => {
                if (node == child) {
                    let className = child.ui.getClassName();
                    this.uiMap[className].pushNode(child);
                    // break;
                }
            });
        } else {
            let className = node.getClassName();
            this.putUI((child) => {
                if (className == child.ui.getClassName()) {
                    this.uiMap[className].pushNode(child);
                }
            });
        }
    }

    public clearAllUI() {
        this.putUI((child) => {
            if (child != this.uiBg) {
                let className = child.ui.getClassName();
                this.uiMap[className].pushNode(child);
            }
        });
    }

    private async loadPrefab(url) {
        let prefab = await resGetPrefab(url);
        return prefab;
    }

    private UIInitAndShow(ui: BaseUI, uiShow: UIShowType, data?: any) {
        ui.node.active = true;
        data && ui.init(data);
        this.uiBg.active = true;
        ui.onShow(uiShow);
    }

    private hideUI(ui: BaseUI, uiHide: UIHideType = UIHideType.none) {
        ui && ui.onHide(uiHide);
    }

    private getUI<T extends BaseUI>(uiClass: UIClass<T>, uiShow: UIShowType, data?: any): BaseUI {
        let className = uiClass.getClassName();
        let uiPath = uiClass.getUrl();

        if (!this.uiMap.get(className)) {
            this.loadPrefab(uiPath).then((prefab) => {
                if (this.uiMap.get(className)) {
                    return null;
                }
                this.uiMap[className] = new PoolPlugin({
                    name: className,
                    prefab: prefab
                });
                let node = this.uiMap[className].getNode();
                let ui = node.getComponent(className);
                this.UIInitAndShow(ui, uiShow, data);
            }).catch((err) => {
                TipMgr.Instance().create(`加载${className}失败`);
            });
        }
        return this.uiMap.get(className) || null;
    }

    private putUI(fn: Function) {
        let children = this.uiRoot.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            fn(child);
        }
    }

}

