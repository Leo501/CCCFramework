import { UIComponent } from "../../Utils/UIKiller/UIComponent";
import { EnumUIPath, UIShowType } from "../../Utils/UIKiller/BaseUI";
import { UIMgr } from "../../Manage/UIManager";
import { TipBoxUI } from "../Common/TipBoxUI";

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
    }

    _onAgreeToggleEnd(event) {
        console.log("_onToggleEnd", event);
    }

    // update (dt) {}
}
