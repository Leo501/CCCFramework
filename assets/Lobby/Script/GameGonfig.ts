import BaseConfig from "./Base/BaseConfig";

export default class GameConfig extends BaseConfig {
    public static checkUrls = {};
    //备份下载地址
    private static backupDownloadUrls = ['https://fivem.whxbwg.com', '', ''];

    private static serverUrls = ['https://192.168.193.50:8331', '', ''];

    private static safeUrls = ['https://192.168.193.50:8331', '', ''];

    private static webUrls = ['', '', '']
    // 服务器类型 0正式服 1测试服 2本地
    public static type = 2;

    public static getBackupDownloadUrl(): string {
        return this.backupDownloadUrls[this.type];
    }

    public static getServerUrl(): string {
        return this.serverUrls[this.type];
    }

    public static getSafeUrl(): string {
        return this.safeUrls[this.type];
    }

    public static getWebUrl(): string {
        return this.webUrls[this.type];
    }
}
