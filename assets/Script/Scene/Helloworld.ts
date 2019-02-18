import BaseUI from "../Utils/UIKiller/BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends BaseUI {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start() {
        // init logic
        // this.label.string = this.text;
    }

    registerEvent() {
        console.log("Hello world");
    }
}
