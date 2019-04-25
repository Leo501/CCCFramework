


export default class ListAdapter {

    private dataSet: any[] = null;
    private componentName: string = "";

    constructor(data: any[], componentName: string) {
        this.dataSet = data;
        this.componentName = componentName;
    }

    appendData(data: any[]) {
        this.dataSet.push.apply(this.dataSet, data);
    }

    getCount() {
        return this.dataSet.length;
    }

    getItem(posIndex: number) {
        return this.dataSet[posIndex];
    }

    _getView(item: cc.Node, posIndex: number) {
        this.updateView(item, posIndex);
        return item;
    }

    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(this.componentName);
        if (comp) {
            comp.init(this.getItem(posIndex));
        }
    }
}
