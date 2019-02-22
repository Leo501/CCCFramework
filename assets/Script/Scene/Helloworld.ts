import BaseUI, { EnumUIDir } from "../Utils/UIKiller/BaseUI";
import Sequence from "../Utils/Action/Sequence";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends BaseUI {

    protected static className = "Helloworld";

    protected static uiDir = EnumUIDir.none;

    start() {

        let sequ = new Sequence();
        let action: cc.ActionInterval = sequ.delay(5).event(() => {
            console.log('hello', this);
        }).action();
        this.node.runAction(action);
    }

    onEnable() {
        console.log('onEnable helloworld');
    }

    registerEvent() {
        console.log("Hello world");
    }
}
