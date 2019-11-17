
export default class AccountInfoModel {
    private static instance: AccountInfoModel = null;
    public static Instance() {
        if (this.instance == null) {
            this.instance = new AccountInfoModel();
        }
        return this.instance;
    }
    private cardCount: number = 0;
    private goldCount: number = 0;
    private diamondCount: number = 0;

    public setCardCount(count: number) {
        this.cardCount = count;
    }
    public setGoldCount(count: number) {
        this.goldCount = count;
    }
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
