import { GameInfoModel } from "../../../Lobby/Script/Data/GameInfoModel";
import { TipBoxData } from "../../../Lobby/Script/UI/BaseUI/TipBoxUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {

    onLoad() {

    }

    start() {
        GameInfoModel.Instance().curGame = "hall";
        // TipMgr.Instance().create("hello");
        let data = <TipBoxData>{};
        data.tip = "只是测试";
        data.onOk = () => {
        }
        // TipBoxMgr.Instance().create(data);
    }

    // update (dt) {}
}
