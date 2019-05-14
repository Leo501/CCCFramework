import { UIComponent } from "../../Utils/UIKiller/UIComponent";
import { observer, render } from "../../Utils/MobX/Observer";
import UserInfoModel from "../../Data/UserInfoModel";

const { ccclass, property } = cc._decorator;

@ccclass
@observer
export default class HallTopUI extends UIComponent {
    onLoad() {
        // this.setCardLabel();
        // this.setDiamondLabel();
        // this.setGoldLabel();
    }

    start() {

    }

    @render
    setCardLabel() {
        let label: cc.Label = this._numCard.$Label;
        let count = UserInfoModel.Instance().getCardCount();
        label.string = '' + count;
    }

    @render
    setGoldLabel() {
        let label: cc.Label = this._numGold.$Label;
        let count = UserInfoModel.Instance().getGoldCount();
        label.string = '' + count;
    }

    @render
    setDiamondLabel() {
        let label: cc.Label = this._numDiamond.$Label;
        let count = UserInfoModel.Instance().getDiamondCount();
        label.string = '' + count;
    }

    _onEmailTouchEnd() {

    }

    update(dt) { }
}
