
const { ccclass, property } = cc._decorator;
import { UIComponent } from "../../Utils/UIKiller/UIComponent";

@ccclass
export default class TipUI extends UIComponent {

    // LIFE-CYCLE CALLBACKS:

    onLoad() { }

    start() {
        console.log('start =', this);
        const label: cc.Label = this._tipLabel.$Label;
        label.string='hello'
    }

    // update (dt) {}
}
