

const {ccclass, property} = cc._decorator;

@ccclass
export default class Thor extends cc.Component {

    editor:Object={
        executeInEditMode: true,
    }
    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log('hello');
    }

    start () {

    }

    // update (dt) {}
}
