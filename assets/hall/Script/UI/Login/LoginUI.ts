import { UIComponent } from "../../Utils/UIKiller/UIComponent";
import { EnumUIPath, UIShowType } from "../../Utils/UIKiller/BaseUI";
import { UIMgr } from "../../Manage/UIManager";
import { TipBoxUI } from "../BaseUI/TipBoxUI";
import LoadingMgr from "../../Manage/LoadingManager";
import Sequence from "../../Utils/Action/Sequence";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginUI extends UIComponent {

    protected static className = "LoginUI";
    protected static uiPath = EnumUIPath.hall;

    onEnable() {

    }

    _onWeixinTouchEnd(event) {
        console.log("_onWeixinTouchEnd", event);
        UIMgr.Instance().openUI(TipBoxUI, UIShowType.none);
        // LoadingMgr.Instance().close();
    }

    _onAgreeToggleEnd(event) {
        console.log("_onToggleEnd", event);
        // LoadingMgr.Instance().create();

        // let action = Sequence.create().delay(5).event(() => {
        //     LoadingMgr.Instance().close()
        // }).action();
        // this.node.runAction(action);
    }

    // update (dt) {}
}
