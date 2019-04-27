import { UIComponent } from "../../Utils/UIKiller/UIComponent";
import { EnumUIPath } from "../../Utils/UIKiller/BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginUI extends UIComponent {

    protected static className = "LoginUI";
    protected static uiPath = EnumUIPath.hall;

    onEnable() {

    }

    _onWeixinTouchEnd(event) {
        console.log("_onWeixinTouchEnd", event);
    }

    _onAgreeToggleEnd(event) {
        console.log("_onToggleEnd", event);
    }

    // update (dt) {}
}
