

const { ccclass, property } = cc._decorator;
import { UIComponent } from "../Utils/UIKiller/UIComponent";
import { TipManager } from "../Manage/TipManager";

@ccclass
export default class NewClass extends UIComponent {

    // LIFE-CYCLE CALLBACKS:
    private aabb: any = '';

    onLoad() {
        this.aabb = 0;
        console.log('aabbcc');
    }

    start() {
         
        // TipManager.getInstance().create("Test Tip");
        console.log('Test UI start');
    }

    _onTestTouchEnd() {
        console.log('hello Test');
        this.aabb++;
        this._tip.$Label.string = this.aabb;
        TipManager.getInstance().create("Test Tip");

    }

    // update (dt) {}
}
