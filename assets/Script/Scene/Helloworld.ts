import BaseUI, { EnumUIDir } from "../Utils/UIKiller/BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends BaseUI {

    protected static className = "Helloworld";

    protected static uiDir = EnumUIDir.none;

    start() {
    }

    onEnable() {
        console.log('onEnable helloworld');
    }

    registerEvent() {
        console.log("Hello world");
    }
}
