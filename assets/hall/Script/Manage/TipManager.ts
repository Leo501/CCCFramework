import { resGetPrefab } from "./ResManager";

export class TipMgr {

    private static instance: TipMgr = null;
    private pool: cc.NodePool = null;
    private prefab: cc.Prefab = null;
    private prefabPath: string = "";
    private name: string = "TipUI";
    private queue: Array<string> = [];

    public static Instance(): TipMgr {
        if (this.instance == null) {
            this.instance = new TipMgr();
        }
        return this.instance;
    }

    constructor() {
        this.prefabPath = "prefab/common/Tip";
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
            this.prefab = await resGetPrefab(this.prefabPath);
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
        let script = node.getComponent(this.name);
        script.showInfo(str);
    }

}
