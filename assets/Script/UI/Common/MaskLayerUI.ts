

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    isBlockInput: boolean = true;

    @property
    isBlackBg: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let visiSize = cc.view.getVisibleSize();
        this.node.width = visiSize.width;
        this.node.height = visiSize.height;
        if (this.isBlackBg) {
            this.node.color = new cc.Color().fromHEX("#000000");
            this.node.opacity = 155;
        }

        if (this.isBlockInput) {
            this.node.addComponent(cc.BlockInputEvents);
        }
    }

    start() {

    }

    // update (dt) {}
}
