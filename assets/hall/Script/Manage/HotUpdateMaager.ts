import VersionInfo from "../Base/VersionInfo";
import UpdateManifest from "../Base/UpdateManifest";


export class UpdateManager {

    private _gameVersionInfo: VersionInfo;
    private _manifest: any;
    private _needRestart: any;
    private _am: any;

    public onCheckVersion: (code, eventCode) => void = null;
    public onProgress: (filesPercent, bytesPercent) => void = null;
    public onRetry: () => void = null;
    public onFinish: (code) => void = null;

    constructor(name, needRestart) {
        this._needRestart = needRestart;
        this._gameVersionInfo = new VersionInfo(name);
        let storagePath = this._gameVersionInfo.getPatchPath();
        this._am = new jsb.AssetsManager('', storagePath, VersionInfo.compareVersion);
        this._am.setVerifyCallback(this.onVerifyCallback);
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }
        let customManifestStr = UpdateManifest.Instance().getManifest(name, storagePath);
        this._manifest = new jsb.Manifest(customManifestStr, storagePath);
        this._am.loadLocalManifest(this._manifest, storagePath);
    }

    private onVerifyCallback(path, asset) {
        var compressed = asset.compressed;
        /**
         * 计算md5
         * @param {*} filePath 
         */
        // let calMD5OfFile = function (filePath) {
        //     return MD5(jsb.fileUtils.getDataFromFile(filePath));
        // };
        if (compressed) {
            return true;
        } else {
            // var resMD5 = calMD5OfFile(path);
            // if (asset.md5 == resMD5) {
            //     return true;
            // }
            // jsb.fileUtils.removeFile(path);
            return true;
        }
    }

    //清除热更新文件
    private clearHotupdateCache() {
        jsb.fileUtils.removeDirectory(this._gameVersionInfo.getPatchPath());
    }

    //清除临时热更新文件
    private clearHotupdateCacheTemp() {
        jsb.fileUtils.removeDirectory(this._gameVersionInfo.getTempPatchPath());
    }

    private checkCb(event) {
        cc.log('Code: ' + event.getEventCode());
        let isNewVersion = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                isNewVersion = true;
                break;
            default:
                return;
        }

        this._am.setEventCallback(null);
        this.onCheckVersion && this.onCheckVersion(isNewVersion, event.getEventCode());
    }

    private updateCb(event) {
        let code = 1;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.onDownloadProgess(event.getPercent(), event.getPercentByFile());
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                code = 2;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                code = 3;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                break;
            default:
                break;
        }

        this._am.setEventCallback(null);

        if (code == 2) {
            if (this._needRestart) {
                cc.game.restart();
            } else {
                this.onFinish && this.onFinish(event.getEventCode());
            }
        } else if (code == 3) {
            this.onRetry && this.onRetry();
        } else {
            this.onFinish && this.onFinish(event.getEventCode());
        }
    }

    /**
     * 下载文件进度
     */
    private onDownloadProgess(byteProgress, fileProgress) {
        byteProgress = Math.round(byteProgress * 100) / 100 || 0;
        fileProgress = Math.round(fileProgress * 100) / 100 || 0;
        this.onProgress && this.onProgress(fileProgress, byteProgress);
    }

    public checkUpdate() {
        this.clearHotupdateCacheTemp();
        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
    }

    public hotUpdate() {
        this._am.setEventCallback(this.updateCb.bind(this));
        this._am.update();
    }

    public retry() {
        this._am.setEventCallback(this.updateCb.bind(this));
        this._am.downloadFailedAssets();
    }

    public clear() {
        this._am.setEventCallback(null);
    }

}

export default class HotUpdateMgr {

    private static _instance: HotUpdateMgr;

    public static Instance(): HotUpdateMgr {
        if (!this._instance) {
            this._instance = new HotUpdateMgr();
        }
        return this._instance;
    }

    private amMap = new Map<string, UpdateManager>();

    public getAssetsManagerByName(name): UpdateManager {
        if (this.amMap.has(name)) {
            return this.amMap.get(name);
        } else {
            let restart = name == 'Lobby' ? true : false;
            let updateManager = new UpdateManager(name, restart);
            this.amMap.set(name, updateManager);
            return updateManager;
        }
    }
}
