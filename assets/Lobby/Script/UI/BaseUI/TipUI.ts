
const { ccclass, property } = cc._decorator;
import { UIComponent } from "../../Utils/UIKiller/UIComponent";
import { TipMgr } from "../../Manage/TipManager";
import { EnumUIPath } from "../../Utils/UIKiller/BaseUI";

@ccclass
export default class TipUI extends UIComponent {

    protected static className = "TipUI";
    protected static uiPath = EnumUIPath.hall;

    private data: any = {};

    onEnable() {
        this.action();

        const label: cc.Label = this._tipLabel.$Label;
        this.node.opacity = 0;
        label.string = this.data.string;
        let size = cc.view.getCanvasSize();
        this.node.y = -size.height * 0.5;
    }

    init(data) {
        this.data = data;
    }

    action() {
        let delayTime = this.data.delayTime || 3
        this.node.runAction(cc.sequence(cc.fadeIn(0.26), cc.delayTime(delayTime), cc.fadeOut(0.52), cc.callFunc(() => {
            TipMgr.Instance().putNode(this.node);
        })));
    }

    unuse() {
        this.node.stopAllActions();
        this.data = {};
    }

}
