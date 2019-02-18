

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseUI extends cc.Component {

    /**
     * 注册事件
     */
    registerEvent() {

    }

    /**
     * 取消事件
     */
    unregisternEvent() {

    }

    onEnable() {
        console.log('onEnable');
        this.registerEvent();
    }

    onDisable() {
        this.unregisternEvent();
    }

    start() {

    }

    // update (dt) {}
}
