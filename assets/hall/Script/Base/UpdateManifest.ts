import GameConfig from "../GameGonfig"

export default class UpdateManifest {

    private static _instance: UpdateManifest

    public static Instance(): UpdateManifest {
        if (!this._instance) {
            this._instance = new UpdateManifest();
        }
        return this._instance;
    }

    private createManifest(gameName): string {
        let url = GameConfig.hotUpdateUrl[gameName];
        if (!url) {
            console.warn('url is null');
        }
        return JSON.stringify({
            "packageUrl": url,
            "remoteManifestUrl": url + "/project.manifest",
            "remoteVersionUrl": url + "/version.manifest",
            "version": "0.0.1",
            "assets": {},
            "searchPaths": []
        });
    }

    public getManifest(game, path) {
        path = path + '/project.manifest';
        if (jsb.fileUtils.isFileExist(path)) {
            let manifestStr = jsb.fileUtils.getStringFromFile(path);
            let manifest = JSON.parse(manifestStr);
            let url = GameConfig.hotUpdateUrl[game];
            manifestStr.packageUrl = url;
            manifestStr.remoteManifestUrl = url + "/project.manifest";
            manifestStr.remoteVersionUrl = url + "/version.manifest";
            return JSON.stringify(manifest);
        } else {
            return this.createManifest(game);
        }
    }
}
