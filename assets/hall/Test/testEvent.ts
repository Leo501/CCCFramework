import { ListenerMgr } from "../Script/Manage/ListenerManager";
import BaseUI from "../Script/Utils/UIKiller/BaseUI";
import { HttpMgr } from "../Script/Net/HttpManage";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends BaseUI {

    start() {
        ListenerMgr.Instance().offAll(this);
        ListenerMgr.Instance().emit('test', 1);

    }

    registerEvent() {
        ListenerMgr.Instance().on('test', this, (data) => {
            console.log('test', data, this);
        });

        ListenerMgr.Instance().on('hello', this, (data) => {
            console.log('hello', data, this);
        });
    }

    // update (dt) {}
}
