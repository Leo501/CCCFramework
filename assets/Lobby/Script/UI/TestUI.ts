
const { ccclass, property } = cc._decorator;
import { UIComponent } from "../Utils/UIKiller/UIComponent";
import { TipMgr } from "../Manage/TipManager";

@ccclass
export default class NewClass extends UIComponent {

    // LIFE-CYCLE CALLBACKS:
    private aabb: any = '';

    onLoad() {
        this.aabb = 0;
        console.log('aabbcc');
    }

    start() {
        console.log('Test UI start');
    }

    _onTestTouchEnd() {
        this.aabb++;
        this._tip.$Label.string = this.aabb;
        TipMgr.Instance().create("Test Tip" + this.aabb);

    }

    // update (dt) {}
}
