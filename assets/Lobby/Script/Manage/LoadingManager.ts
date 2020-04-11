import { resGetPrefab } from "./ResManager";
import LoadingUI from "../UI/BaseUI/LoadingUI";

export default class LoadingMgr {

    private static instance: LoadingMgr = new LoadingMgr();
    private prefab: cc.Prefab = null;
    private name: string = "LoadingUI";
    private pool: cc.NodePool = null;

    public static Instance(): LoadingMgr {
        // if (this.instance == null) {
        //     this.instance = new LoadingMgr();
        // }
        return this.instance;
    }

    constructor() {
        this.pool = new cc.NodePool(this.name);
    }

    public async create() {
        if (this.prefab == null) {
            this.prefab = await resGetPrefab(LoadingUI.getUrl());
        }
        this.initUI();
        return null;
    }

    public close() {
        let child = this.getRoot().children;
        child.forEach((node) => {
            if (node.name == this.name) {
                this.pool.put(node);
            }
        });
    }

    private initUI() {
        let node: cc.Node = null;
        if (this.pool.size() == 0) {
            node = cc.instantiate(this.prefab);
        } else {
            node = this.pool.get();
        }
        this.getRoot().addChild(node);
    }

    private getRoot(): cc.Node {
        return cc.find("Canvas/Const");
    }

}
