import UserInfoModel from "../Data/UserInfoModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallScene extends cc.Component {

    onLoad() { }

    start() {
        UserInfoModel.Instance();
    }

    // update (dt) {}
}
