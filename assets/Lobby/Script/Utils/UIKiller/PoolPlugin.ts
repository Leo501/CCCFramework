

export class PoolPlugin {

    private scriptName: string;
    private pool: cc.NodePool;
    private prefab: cc.Prefab;

    constructor(data) {
        this.scriptName = data.name;
        this.pool = new cc.NodePool(data.name);
        this.prefab = data.prefab;
    }

    getNode(): cc.Node {
        if (this.pool.size() > 0) {
            return this.pool.get();
        } else {
            let node = cc.instantiate(this.prefab);
            if (this.scriptName) {
                node.ui = node.getComponent(this.scriptName);
            }
            return node;
        }
    }

    pushNode(node: cc.Node) {
        console.log('pushNode');
        let _pool = this.pool._pool;
        let count = _pool.length;
        for (let i = 0; i < count; i++) {
            let item = _pool[i];
            if (item == node) {
                console.log('node 重复回收');
                return false;
            }
        }
        this.pool.put(node);
        return true;
    }

    clear() {
        if (this.pool) {
            this.pool.clear();
        }
        this.pool = null;
    }

}
