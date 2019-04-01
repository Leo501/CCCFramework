import { UIComponent } from "../../Utils/UIKiller/UIComponent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TipBoxUI extends UIComponent {

    protected static className = "TipBoxUI";

    private onClose: Function;
    private onCancel: Function;
    private onConfirm: Function;

    onLoad() {

    }

    init(data) {
        this.showTitle(data.title);
        this.showInfo(data.tip);
        this.onClose = data.onClose;
        this.onCancel = data.onCancel;
        this.onConfirm = data.onConfirm;
    }

    showTitle(str = "提示") {
        let label: cc.Label = this._title.$Label;
        label.string = str;
    }

    showInfo(str = '') {
        let label: cc.Label = this._content.$Label;
        label.string = str;
    }

    start() {

    }

    _onCloseTouchEnd(event) {
        console.log('_onCloseTouchEnd');

    }

    _onCancelTouchEnd(event) {
        console.log('_onCancelTouchEnd');

    }

    _onConfirmTouchEnd(event) {
        console.log('_onConfirmTouchEnd');

    }

    // update (dt) {}
}
