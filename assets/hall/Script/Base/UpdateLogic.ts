
import { HttpMgr, ReqOption } from "../Net/HttpManage"
import HotUpdateMgr, { UpdateManager } from "../Manage/HotUpdateMaager";
import { ListenerMgr } from "../Manage/ListenerManager";

export default class UpdateLogic {

    // private static _instance: UpdateLogic;

    // public static Instance(): UpdateLogic {
    //     if (!this._instance) {
    //         this._instance = new UpdateLogic();
    //     }
    //     return this._instance;
    // }

    private gameName: string;
    public onFinish: () => void = null;
    private updteMgr: UpdateManager;

    public startUpdate(gameName) {
        this.gameName = gameName;
        this.requestUpdateUrl(this.gameName);
    }

    private requestUpdateUrl(gameName) {
        ListenerMgr.Instance().emit('update_check_version_push');
        //从网络中取得更新url
        let opt: ReqOption = {};
        HttpMgr.Instance().request(opt)
            .then(this.onReqUpdateUrlSuccess.bind(this))
            .catch(this.onReqUpdateUrlFail.bind(this));

    }

    private onReqUpdateUrlFail(err) {
        console.log('get updateUrl fail');
        ListenerMgr.Instance().emit('update_check_version_finish_push');
        this.onUpdateFinish();
    }

    private onReqUpdateUrlSuccess(data) {
        if (data.code == 0) {
            this.startCheckVersion(this);
        } else {
            this.onUpdateFinish();
        }
    }

    private startCheckVersion(gameName) {
        this.updteMgr = HotUpdateMgr.Instance().getAssetsManagerByName(gameName);
        this.updteMgr.onCheckVersion = this.onCheckVersion.bind(this);
        this.updteMgr.checkUpdate();
    }

    private onCheckVersion(isNewVersion, code) {
        if (isNewVersion) {
            //有新版本
            this.startDownload();
        } else {
            //无新版本
            this.onUpdateFinish();
        }
    }

    private startDownload() {
        this.updteMgr.onProgress = (fileProgress, byteProgress) => {
            ListenerMgr.Instance().emit('update_start_version_progress_push', fileProgress, byteProgress);
        };
        this.updteMgr.onRetry = () => {
            ListenerMgr.Instance().emit('update_start_version_retry_push');
        }
        this.updteMgr.onFinish = this.onUpdateFinish.bind(this);

        this.updteMgr.hotUpdate();
        ListenerMgr.Instance().emit('update_start_version_push');
    }

    public onUpdateFinish() {
        this.onFinish && this.onFinish();
        this.updteMgr.onCheckVersion = null
        this.updteMgr.onProgress = null;
        this.updteMgr.onRetry = null;
        this.updteMgr.onFinish = null;
        this.updteMgr = null;
        HotUpdateMgr.Instance().clearAssetsManagerByName(this.gameName);
    }
}
