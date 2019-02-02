import TipUI from "../UI/Common/TipUI";



export class TipManager {

    private static instance: TipManager = null;
    private pool: cc.NodePool = null;
    private prefab: cc.Prefab = null;
    private prefabPath: string = "";
    private name: string = "TipUI";

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

    public putNode(node: cc.Node) {
        this.pool.put(node);
    }

    public async create(str) {
        console.log('TipManager');
        let node: cc.Node = null;
        if (this.prefab == null) {
            this.prefab = await this.getPrefab(this.prefabPath);
        }
        if (this.pool.size() == 0) {
            node = cc.instantiate(this.prefab);
        } else {
            node = this.pool.get();
        }
        let script = node.getComponent(this.name);
        script.show(str);

        return script;
    }

}
