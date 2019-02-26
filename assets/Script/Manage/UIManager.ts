import BaseUI, { UIClass } from "../Utils/UIKiller/BaseUI";

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

    public getUI<T extends BaseUI>(uiClass: UIClass<T>): BaseUI {
        // for (let i = 0; i, this.)
        return null;
    }
}

