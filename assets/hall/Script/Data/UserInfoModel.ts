import { observable, action } from "mobx";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UserInfoModel {

    private static instance: UserInfoModel = null;
    public static Instance() {
        if (this.instance == null) {
            this.instance = new UserInfoModel();
        }
        return this.instance;
    }

    @observable
    private cardCount: number = 0;
    @observable
    private goldCount: number = 0;
    @observable
    private diamondCount: number = 0;

    @action
    public setCardCount(count: number) {
        this.cardCount = count;
    }
    @action
    public setGoldCount(count: number) {
        this.goldCount = count;
    }
    @action
    public setDiamondCount(count: number) {
        this.diamondCount = count;
    }

    public getCardCount() {
        return this.cardCount;
    }

    public getGoldCount() {
        return this.goldCount;
    }

    public getDiamondCount() {
        return this.diamondCount;
    }

}
