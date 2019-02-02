
export class TipManager {

    private static instance: TipManager = null;
    private pool: cc.NodePool = null;
    private prefab: cc.Prefab = null;
    private prefabPath: string = "";
    private name: string = "TipUI";
    private queue: Array<string> = [];

    public static getInstance(): TipManager {
        if (this.instance == null) {
            this.instance = new TipManager();
            this.instance.init();
        }
        return this.instance;
    }

    private init() {
        this.prefabPath = "prefab/common/Tip";
        this.pool = new cc.NodePool(this.name);
    }

    private getPrefab(url): Promise<cc.Prefab> {
        let p = new Promise<cc.Prefab>((resolve, reject) => {
            cc.loader.loadRes(url, (e, prefab) => {
                if (e) {
                    reject(e);
                } else {
                    resolve(prefab);
                }
            });
        });
        return p;
    }

    /**
     * 创建
     * @param str 
     */
    public async create(str: string) {
        console.log('TipManager');
        if (this.prefab == null) {
            this.prefab = await this.getPrefab(this.prefabPath);
        }
        this.queue.push(str);
        //进入队列
        if (this.queue.length > 1) {
            return null;
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
        script.show(str);
    }

}
