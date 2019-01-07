const {ccclass, property} = cc._decorator;
import cocosHelp = require('../Utils/UIKiller/cocos-help');

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start () {
        // init logic
        this.label.string = this.text;
    }
}
