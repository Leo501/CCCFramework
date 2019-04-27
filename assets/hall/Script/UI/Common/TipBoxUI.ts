import { UIComponent } from "../../Utils/UIKiller/UIComponent";
import { EnumUIPath } from "../../Utils/UIKiller/BaseUI";


export enum TipBoxEnum {
    Ok,
    Select,
};

export let CTipBoxEnum = { type: cc.Enum(TipBoxEnum) }

const { ccclass, property } = cc._decorator;

@ccclass
export class TipBoxUI extends UIComponent {

    protected static className = "TipBoxUI";
    protected static uiPath = EnumUIPath.hall;

    @property(CTipBoxEnum)
    public type: TipBoxEnum = TipBoxEnum.Ok;

    private onClose: Function;
    private onCancel: Function;
    private onConfirm: Function;

    onLoad() {
        console.log(this);
    }

    init(data) {
        this.showTitle(data.title);
        this.showInfo(data.tip);
        this.onClose = data.onClose;
        this.onCancel = data.onCancel;
        this.onConfirm = data.onConfirm;
        return this;
    }

    seletType(type: TipBoxEnum) {
        switch (type) {
            case TipBoxEnum.Ok: {
                this._ok.active = true;
                this._cancel.active = false;
                this._confirm.active = false;
                break;
            }
            case TipBoxEnum.Select: {
                this._ok.active = false;
                this._cancel.active = true;
                this._confirm.active = true;
                break;
            }
        }
        return this;
    }

    showTitle(str = "提  示") {
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
