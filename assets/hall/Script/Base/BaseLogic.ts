import GameConfig from "../GameGonfig";
import { ListenerMgr } from "../Manage/ListenerManager";

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

    public startCheck() {
        //
        ListenerMgr.Instance().emit('UI_check_update_push');
    }

}
