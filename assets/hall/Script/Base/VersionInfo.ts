
export default class VersionInfo {

    private gameName: string;
    private resPath: string;
    private patchPath: string;

    constructor(gameName) {
        this.gameName = gameName;
        if (gameName == 'Lobby') {
            this.resPath = gameName;
        } else {
            this.resPath = 'Games/' + gameName;
        }
        this.patchPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this.resPath);
    }

    public getPatchPath(): string {
        return this.patchPath;
    }

    public saveUpdateVersion(updateVersion) {
        let key = 'CurrentVersion_' + this.gameName;
        cc.sys.localStorage.setItem(key, updateVersion);
    }

    /**
     * A > B outPut 正数
     * A < B outPut 负数
     * @param versionA 
     * @param versionB 
     */
    public compareVersion(versionA, versionB) {
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    }
}
