import ListAdapter from "./ListAdapter";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ListView extends cc.Component {

    @property(cc.Prefab)
    itemTemplate: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property
    spacing: number = 2;

    @property
    spawnCount: number = 4;

    private content: cc.Node;
    private adapter: ListAdapter;
    private _items: cc.NodePool;
    private _filledIds: object;
    private horizontal: boolean;
    private _itemHeight: number;
    private _itemWidth: number;
    private _itemsVisible: number;
    private lastStartIndex: number;
    private scrollTopNotifyed: boolean;
    private scrollBottomNotifyed: boolean;
    private pullDownCallback: Function;
    private pullUpCallback: Function;

    initProperties() {
        this.content = null;
        this.adapter = null;
        this._items = new cc.NodePool();
        // 记录当前填充在树上的索引. 用来快速查找哪些位置缺少item了.
        this._filledIds = {};
        this.horizontal = false;
        // 初始时即计算item的高度.因为布局时要用到.
        this._itemHeight = 1;
        this._itemWidth = 1;
        this._itemsVisible = 1;
        this.lastStartIndex = -1;
        this.scrollTopNotifyed = false;
        this.scrollBottomNotifyed = false;
        this.pullDownCallback = () => { };
        this.pullUpCallback = () => { };
    }

    onLoad() {
        if (this.scrollView) {
            this.content = this.scrollView.content;
            this.horizontal = this.scrollView.horizontal;
            if (this.horizontal) {
                this.scrollView.vertical = false;
                this.content.anchorX = 0;
                this.content.x = this.content.parent.width * this.content.parent.anchorX;
            } else {
                this.scrollView.vertical = true;
                this.content.anchorY = 1;
                this.content.y = this.content.parent.height * this.content.parent.anchorY;
            }
        } else {
            console.error('ListView need a scrollView for showing.');
        }
        let itemOne = this._items.get() || cc.instantiate(this.itemTemplate);
        this._items.put(itemOne);
        this._itemHeight = itemOne.height || 10;
        this._itemWidth = itemOne.width || 10;

        if (this.horizontal) {
            this._itemsVisible = Math.ceil(this.content.parent.width / this._itemWidth);
        } else {
            this._itemsVisible = Math.ceil(this.content.parent.height / this._itemHeight);
        }

        this.adjustEvent();
    }

    start() {

    }

    /**
     * 设置数据
     * @param adapter 
     */
    setAdapter(adapter: ListAdapter) {
        this.adapter = adapter;
        if (this.adapter == null) {
            console.warn('adapter 为空.');
            return;
        }
        if (this.itemTemplate == null) {
            console.error('Listview 未设置待显示的Item模板.');
            return;
        }
        this.clearState();
        this.notifyUpdate();
    }

    appendList(data: any[]) {
        this.adapter.appendData(data);
        this.resetScrollLength();
    }

    clearState() {
        this.scrollTopNotifyed = false;
        this.scrollBottomNotifyed = false;
    }

    scrollToTop(anim = false) {
        this.scrollView.scrollToTop(anim ? 1 : 0);
    }

    scrollToBottom(anim = false) {
        this.scrollView.scrollToBottom(anim ? 1 : 0);
    }

    scrollToLeft(anim = false) {
        this.scrollView.scrollToLeft(anim ? 1 : 0);
    }

    scrollToRight(anim = false) {
        this.scrollView.scrollToRight(anim ? 1 : 0);
    }

    // 下拉事件.
    pullDown(callback, this$) {
        this.pullDownCallback = callback.bind(this$);
    }

    // 上拉事件.
    pullUp(callback, this$) {
        this.pullUpCallback = callback.bind(this$);
    }

    // 数据变更了需要进行更新UI显示, 可只更新某一条.
    notifyUpdate(updateIndex?: any[]) {
        if (this.adapter == null) {
            return;
        }
        if (updateIndex && updateIndex.length > 0) {
            updateIndex.forEach(i => {
                if (this._filledIds.hasOwnProperty(i)) {
                    let node = this.getChildNodeByIdx(i);
                    node && this._items.put(node);
                    delete this._filledIds[i];
                }
            });
        } else {
            Object.keys(this._filledIds).forEach(key => {
                let idx = this._filledIds[key];
                let node = this.getChildNodeByIdx(idx);
                node && this._items.put(node);
                delete this._filledIds[key];
            });
        }
        this.lastStartIndex = -1;
        this.resetScrollLength();

        this.scrollView.scrollToTop();
    }

    resetScrollLength() {
        if (this.horizontal) {
            this.content.width = this.adapter.getCount() * (this._itemWidth + this.spacing) + this.spacing;
        } else {
            this.content.height = this.adapter.getCount() * (this._itemHeight + this.spacing) + this.spacing; // get total content height
        }
    }

    getItemIndex(height: number) {
        return Math.floor(Math.abs(height / ((this._itemHeight + this.spacing))));
    }

    getPositionInView(item: cc.Node) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }

    adjustEvent() {
        this.content.on(this.isMobile() ? cc.Node.EventType.TOUCH_END : cc.Node.EventType.MOUSE_UP, () => {
            this.scrollTopNotifyed = false;
            this.scrollBottomNotifyed = false;
        }, this);
        this.content.on(this.isMobile() ? cc.Node.EventType.TOUCH_CANCEL : cc.Node.EventType.MOUSE_LEAVE, () => {
            this.scrollTopNotifyed = false;
            this.scrollBottomNotifyed = false;
        }, this);
    }

    isMobile() {
        return (cc.sys.isMobile || cc.sys.platform === cc.sys.WECHAT_GAME || cc.sys.platform === cc.sys.QQ_PLAY);
    }

    update(dt) {
        const startIndex = this.checkNeedUpdate();
        // console.log('startIdx=', startIndex);
        if (startIndex >= 0) {
            this.updateView(startIndex);
        }
    }

    // 向某位置添加一个item.
    _layoutVertical(child: cc.Node, posIndex: number) {
        this.content.addChild(child);
        // 增加一个tag 属性用来存储child的位置索引.
        child['_tag'] = posIndex;
        this._filledIds[posIndex] = posIndex;
        child.setPosition(0, -child.height * (0.5 + posIndex) - this.spacing * (posIndex + 1));
    }

    // 向某位置添加一个item.
    _layoutHorizontal(child: cc.Node, posIndex: number) {
        this.content.addChild(child);
        // 增加一个tag 属性用来存储child的位置索引.
        child['_tag'] = posIndex;
        this._filledIds[posIndex] = posIndex;
        child.setPosition(-child.width * (0.5 + posIndex) - this.spacing * (posIndex + 1), 0);
    }

    /**
     * 通过idx 
     * 取得 content中的 node
     * @param {*} idx 
     */
    getChildNodeByIdx(idx) {
        let children = this.content.children || [];
        for (let i = 0; i < children.length; i++) {
            let item = children[i];
            if (item['_tag'] == idx) {
                return item;
            }
        }
        return null;
    }

    // 获取可回收item
    getRecycleItems(beginIndex, endIndex) {
        const children = this.content.children;
        const recycles = [];
        children.forEach(item => {
            if (item['_tag'] < beginIndex || item['_tag'] > endIndex) {
                recycles.push(item);
                delete this._filledIds[item['_tag']];
            }
        });
        return recycles;
    }

    // 填充View.
    updateView(startIndex) {
        let itemStartIndex = startIndex;
        // 比实际元素多3个.
        let itemEndIndex = itemStartIndex + this._itemsVisible + (this.spawnCount || 2);
        const totalCount = this.adapter.getCount();
        if (itemStartIndex >= totalCount) {
            return;
        }

        if (itemEndIndex > totalCount) {
            itemEndIndex = totalCount;
            if (!this.scrollBottomNotifyed) {
                this.notifyScrollToBottom();
                this.scrollBottomNotifyed = true;
            }
        } else {
            this.scrollBottomNotifyed = false;
        }

        // 回收需要回收的元素位置.向上少收一个.向下少收2两.
        const recyles = this.getRecycleItems(itemStartIndex - (this.spawnCount || 2), itemEndIndex);
        recyles.forEach(item => {
            this._items.put(item);
        });

        // 查找需要更新的元素位置.
        const updates = this.findUpdateIndex(itemStartIndex, itemEndIndex);

        // 更新相应位置.
        for (let index of updates) {
            let child = this.adapter._getView(this._items.get() || cc.instantiate(this.itemTemplate), index);
            this.horizontal ?
                this._layoutHorizontal(child, index) :
                this._layoutVertical(child, index);
        }
    }

    // 检测是否需要更新UI.
    checkNeedUpdate() {
        if (this.adapter == null) {
            return -1;
        }

        let scroll = this.horizontal ? (this.content.x - this.content.parent.width * this.content.parent.anchorX) :
            (this.content.y - this.content.parent.height * this.content.parent.anchorY);
        if (scroll < 0) { //为负有bug
            scroll = 0;
        }
        let itemStartIndex = Math.floor(scroll / ((this.horizontal ? this._itemWidth : this._itemHeight) + this.spacing));
        if (itemStartIndex < 0 && !this.scrollTopNotifyed) {
            this.notifyScrollToTop();
            this.scrollTopNotifyed = true;
            return itemStartIndex;
        }
        // 防止重复触发topNotify.仅当首item不可见后才能再次触发
        if (itemStartIndex > 0) {
            this.scrollTopNotifyed = false;
        }

        if (this.lastStartIndex != itemStartIndex) {
            this.lastStartIndex = itemStartIndex;
            return itemStartIndex;
        }

        return -1;
    }

    // 查找需要补充的元素索引.
    findUpdateIndex(itemStartIndex: number, itemEndIndex: number): any[] {
        const d = [];
        for (let i = itemStartIndex; i < itemEndIndex; i++) {
            if (this._filledIds.hasOwnProperty(i)) {
                continue;
            }
            d.push(i);
        }
        return d;
    }

    notifyScrollToTop() {
        if (!this.adapter || this.adapter.getCount() <= 0) {
            return;
        }
        if (this.pullDownCallback) {
            this.pullDownCallback();
        }
    }

    notifyScrollToBottom() {
        if (!this.adapter || this.adapter.getCount() <= 0) {
            return;
        }
        if (this.pullUpCallback) {
            this.pullUpCallback();
        }
    }
}
