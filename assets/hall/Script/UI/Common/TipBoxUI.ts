import { UIComponent } from "../../Utils/UIKiller/UIComponent";
import { EnumUIPath } from "../../Utils/UIKiller/BaseUI";
import TipBoxMgr from "../../Manage/TipBoxUIManager";


export enum TipBoxEnum {
    Ok,
    Select,
};

export interface TipBoxData {
    title: string,
    tip: string,
    closeLabel: string,
    cancelLabel: string,
    confirmLabel: string,
    type: TipBoxEnum,
    onOk: Function,
    onClose: Function,
    onConfirm: Function,
    onCancel: Function
}

export let CTipBoxEnum = { type: cc.Enum(TipBoxEnum) }

const { ccclass, property } = cc._decorator;

@ccclass
export class TipBoxUI extends UIComponent {

    protected static className = "TipBoxUI";
    protected static uiPath = EnumUIPath.hall;

    @property(CTipBoxEnum)
    public type: TipBoxEnum = TipBoxEnum.Ok;

    private onOk: Function;
    private onClose: Function;
    private onCancel: Function;
    private onConfirm: Function;

    protected data: TipBoxData;

    onLoad() {
        console.log(this);
    }

    onEnable() {
        this.showTitle(this.data.title);
        this.showInfo(this.data.tip);
        this.seletType(this.data.type || this.type);

        this.onOk = this.data.onOk;
        this.onClose = this.data.onClose;
        this.onCancel = this.data.onCancel;
        this.onConfirm = this.data.onConfirm;

        this.data.closeLabel && this.setBtnLabel(this._ok, this.data.closeLabel);
        this.data.cancelLabel && this.setBtnLabel(this._cancel, this.data.cancelLabel);
        this.data.confirmLabel && this.setBtnLabel(this._confirm, this.data.confirmLabel);

    }

    init(data: TipBoxData) {
        this.data = data;
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

    showInfo(str = '测试中---') {
        let label: cc.Label = this._content.$Label;
        label.string = str;
    }

    setBtnLabel(node, str) {
        let label: cc.Label = node.Label.getComponent(cc.Label);
        label.string = str;
    }

    _onCloseTouchEnd(event) {
        console.log('_onCloseTouchEnd');
        this.onClose && this.onClose();
        TipBoxMgr.Instance().putNode(this.node);
    }

    _onCancelTouchEnd(event) {
        console.log('_onCancelTouchEnd');
        this.onCancel && this.onCancel();
        TipBoxMgr.Instance().putNode(this.node);
    }

    _onConfirmTouchEnd(event) {
        console.log('_onConfirmTouchEnd');
        this.onConfirm && this.onConfirm();
        TipBoxMgr.Instance().putNode(this.node);
    }

    _onOkTouchEnd(event) {
        this.onOk && this.onOk();
        TipBoxMgr.Instance().putNode(this.node);
    }

    // update (dt) {}
}
