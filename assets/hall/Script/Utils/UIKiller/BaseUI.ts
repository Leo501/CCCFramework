import { ConstValue } from "../../Data/ConstValue";

const { ccclass, property } = cc._decorator;

export enum UIShowType {
    none = -1,
    scaleIn = 1,
}

export enum UIHideType {
    none = -1,
    scaleOut = 1,
}

export enum EnumUIPath {
    none = "",
    hall = "hall/prefab"
}

export interface UIClass<T extends BaseUI> {
    new(): T;
    getUrl(): string;
    getClassName(): string;
}

@ccclass
export default class BaseUI extends cc.Component {

    protected static className = "BaseUI";

    protected static uiPath = EnumUIPath.none;

    protected static directory = "common";

    protected mTag: any;

    protected data: any = {};

    public get tag(): any {
        return this.mTag;
    }

    public set tag(value: any) {
        this.mTag = value;
    }

    public static getClassName() {
        return this.className;
    }

    public static getUrl(): string {
        cc.log(this.className);
        return `${this.uiPath}/${this.directory}/${this.className}`;
    }

    init(data) {

    }

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
        // console.log('onEnable');
        this.registerEvent();
    }

    onDisable() {
        this.unregisternEvent();
    }

    onShow(type: UIShowType) {
        console.log(type);
    }

    onHide(type: UIHideType) {
        console.log(type);
    }
}
