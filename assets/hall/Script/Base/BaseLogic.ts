import GameConfig from "../GameGonfig";
import UpdateLogic from "./UpdateLogic";

export default class BaseLogic {

    private static instance: BaseLogic;

    public static Instance(): BaseLogic {
        if (!this.instance) {
            this.instance = new BaseLogic();
        }
        return this.instance;
    }

    //1 为进行热更新 2。登陆 3。进入大厅
    private mainState: number = 0;
    private updateLogic: UpdateLogic;
    constructor() {

    }

    private initConfig() {
        if (GameConfig.ignoreUpdate) {
            this.mainState = 1;
        } else {
            this.mainState = 2;
        }
    }


    public initGame() {

    }

    //进行更新检测
    public startCheck() {
        this.updateLogic = new UpdateLogic();
        this.updateLogic.onFinish = this.onCheckoutUpdateFinish.bind(this);
        this.updateLogic.startUpdate('Lobby');
    }

    //进入登陆页面
    public startLogin() {

    }

    //开始进入大厅
    public startLobby() {

    }

    private onCheckoutUpdateFinish() {
        this.mainState = 2;
        this.startLogin();
    }

}
