import { TipMgr } from "../Manage/TipManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // onLoad () {}

    start() {
        TipMgr.Instance().create("hello");
    }

    // update (dt) {}
}
