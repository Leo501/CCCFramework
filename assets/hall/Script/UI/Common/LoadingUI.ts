import { UIComponent } from "../../Utils/UIKiller/UIComponent";
import { EnumUIPath } from "../../Utils/UIKiller/BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingUI extends UIComponent {

    protected static className = "LoadingUI";
    protected static uiPath = EnumUIPath.hall;

    private icon: cc.Node;

    onLoad() {
        this.icon = this._icon;
    }

    start() {

    }

    update(dt) {
        let rotation = this.icon.rotation + 100 * dt;
        this.icon.rotation = rotation;
    }
}
