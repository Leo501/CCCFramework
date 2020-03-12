import { resGetPrefab } from "./ResManager";
import TipUI from "../UI/BaseUI/TipUI";

export class TipMgr {

    private static instance: TipMgr = new TipMgr();
    private pool: cc.NodePool = null;
    private prefab: cc.Prefab = null;
    private prefabPath: string = "";
    private name: string = "TipUI";
    private queue: Array<string> = [];

    public static Instance(): TipMgr {
        // if (this.instance == null) {
        //     this.instance = new TipMgr();
        // }
        return this.instance;
    }

    constructor() {
        this.pool = new cc.NodePool(this.name);
    }

    /**
     * 创建
     * @param str 
     */
    public async create(str: string) {
        console.log('TipMgr');
        this.queue.push(str);
        //进入队列
        if (this.queue.length > 1) {
            return null;
        }
        if (this.prefab == null) {
            this.prefab = await resGetPrefab(TipUI.getUrl());
        }
        this.initTip(str);
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

    private initTip(str) {
        let node: cc.Node = null;
        if (this.pool.size() == 0) {
            node = cc.instantiate(this.prefab);
        } else {
            node = this.pool.get();
        }
        let ui = node.getComponent(this.name);
        ui.init({
            string: str
        });
        this.getRoot().addChild(node);
    }

    private getRoot(): cc.Node {
        return cc.find("Canvas/Toast");
    }

}
