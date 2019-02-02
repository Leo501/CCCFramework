
const { ccclass, property } = cc._decorator;
import { UIComponent } from "../../Utils/UIKiller/UIComponent";
import { TipManager } from "../../Manage/TipManager";

@ccclass
export default class TipUI extends UIComponent {

    private data: any = {};

    onEnable() {
        this.init();
        this.action();
    }

    init() {
        let data = this.data;
        const label: cc.Label = this._tipLabel.$Label;
        this.node.opacity = 0;
        label.string = data.string;
        let size = cc.view.getCanvasSize();
        this.node.y = -size.height * 0.5;
    }

    show(str: string) {
        this.data.string = str;
        let parent = cc.find('Canvas');
        parent.addChild(this.node);
    }

    action() {
        let delayTime = this.data.delayTime || 3
        this.node.runAction(cc.sequence(cc.fadeIn(0.26), cc.delayTime(delayTime), cc.fadeOut(0.52), cc.callFunc(() => {
            TipManager.getInstance().putNode(this.node);
        })));
    }

    unuse() {
        this.node.stopAllActions();
        this.data = {};
    }

}
