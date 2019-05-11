import { BaseConfigContainer, ConfigContainerClass } from "../Config/BaseConfigContainer";


export default class ConfigMgr {
    private static instance: ConfigMgr = new ConfigMgr();

    private configContainerList: BaseConfigContainer[] = [];

    public static Instance() {
        // if (this.instance == null) {
        //     this.instance = new ConfigMgr();
        // }
        return this.instance;
    }

    public loadConfig<T extends BaseConfigContainer>(tag: string, config: ConfigContainerClass<T>) {

        let len = this.configContainerList.length;
        for (let i = 0; i < len; i++) {
            let contailner = this.configContainerList[i];
            if (contailner.tag == tag)
                return contailner;
        }
        let contailner = new config();
        this.configContainerList.push(contailner);
        return contailner;
    }

    public closeConf<T extends BaseConfigContainer>(tag: string) {
        let len = this.configContainerList.length;
        for (let i = 0; i < len; i++) {
            let contailner = this.configContainerList[i];
            if (contailner.tag == tag) {
                this.configContainerList.splice(i);
                return true;
            }
        }
        return false;
    }

    public closeAll() {
        delete this.configContainerList;
    }
}