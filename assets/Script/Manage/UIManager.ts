import BaseUI, { UIClass } from "../Utils/UIKiller/BaseUI";

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
    private uiRoot: cc.Node = null;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new UIMgr();
        }
        return this.instance;
    }

    constructor() {
        this.uiRoot = cc.find("Canvas");
    }

    

    public getUI<T extends BaseUI>(uiClass: string): BaseUI {
        return this.uiMap.get(uiClass) || null;
    }
}

