

export default class BaseConfig {

    public static proxyPorts = [];
    public static initProxy = false;//高防
    public static ignoreUpdate = true;   //忽略热更?
    public static iosCheck = false;       //ios提审开关
    public static iosCheckPak = false;     //ios提审包
    public static winAutoLogin = false; //windows是否自动登录
    public static dnsResolves = [0, 1];  //http访问时使用的dns预解析方式(0:不解析  1:httpdns ...)

    //热更新url
    public static hotUpdateUrl = { 'Lobby': 'http://192.168.0.116/down/remote-assets/' };

}
