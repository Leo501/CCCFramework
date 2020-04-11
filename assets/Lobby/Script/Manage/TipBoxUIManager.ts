import { resGetPrefab } from "./ResManager";
import { TipBoxUI, TipBoxData } from "../UI/BaseUI/TipBoxUI";

export default class TipBoxMgr {

    private static instance: TipBoxMgr = new TipBoxMgr();
    private pool: cc.NodePool = null;
    private prefab: cc.Prefab = null;
    private name: string = "TipBoxUI";
    private queue: Array<any> = [];

    public static Instance(): TipBoxMgr {
        // if (this.instance == null) {
        //     this.instance = new TipBoxMgr();
        // }
        return this.instance;
    }

    constructor() {
        console.log('TipBoxMgr');
        this.pool = new cc.NodePool(this.name);
    }

    /**
    * 创建
    * @param str 
    */
    public async create(data: TipBoxData) {
        console.log('TipMgr');
        this.queue.push(data);
        //进入队列
        if (this.queue.length > 1) {
            return null;
        }
        if (this.prefab == null) {
            this.prefab = await resGetPrefab(TipBoxUI.getUrl());
        }
        this.initTip(data);
        return null;
    }

    /**
     * 回收
     * @param node 
     */
    public putNode(node: cc.Node) {
        this.pool.put(node);
        this.queue.shift();
        if (this.queue.length == 0) return;
        let nextStr = this.queue[0];
        this.initTip(nextStr);
    }

    private initTip(data) {
        let node: cc.Node = null;
        if (this.pool.size() == 0) {
            node = cc.instantiate(this.prefab);
        } else {
            node = this.pool.get();
        }
        let ui: TipBoxUI = node.getComponent(this.name);
        ui.init(data);
        this.getRoot().addChild(node);
    }

    private getRoot(): cc.Node {
        return cc.find("Canvas/Const");
    }
}
