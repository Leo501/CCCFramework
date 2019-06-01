import { KBEngineArgs } from "../Libs/kbengine";
import { ListenerMgr } from "../Manage/ListenerManager";

export class SocketMgr {

    private static instance: SocketMgr = null;

    public static Instance() {
        if (this.instance == null) {
            this.instance = new SocketMgr();
        }
        return this.instance;
    }

    initKbengine(parameter) {
        let args = new KBEngineArgs();
        args.port = parameter.port
        args.ip = parameter.ip;
        KBEngine.create(args);
        this.installEvents();
    }

    destroyKbengine() {
        this.unInstallEvents();
    }

    installEvents() {
        //
        KBEngine.Event.register('onConnectionState', this, 'onConnectionState');
        KBEngine.Event.register('onLoginFailed', this, 'onLoginFailed');
        KBEngine.Event.register('onLoginBaseappFailed', this, 'onLoginBaseappFailed');
        KBEngine.Event.register('recvTestData', this, 'recvTestData');
        KBEngine.Event.register('onDisconnected', this, 'onDisconnected');
        KBEngine.Event.register('onStreamDataStarted', this, 'onStreamDataStarted');
        KBEngine.Event.register('onStreamDataRecv', this, 'onStreamDataRecv');
        KBEngine.Event.register('onStreamDataCompleted', this, 'onStreamDataCompleted');

    }

    unInstallEvents() {
        KBEngine.Event.deregister('onConnectionState', this, 'onConnectionState');
        KBEngine.Event.deregister('onLoginFailed', this, 'onLoginFailed');
        KBEngine.Event.deregister('onLoginBaseappFailed', this, 'onLoginBaseappFailed');
        KBEngine.Event.deregister('recvTestData', this, 'recvTestData');
        KBEngine.Event.deregister('onDisconnected', this, 'onDisconnected');
        KBEngine.Event.deregister('onStreamDataStarted', this, 'onStreamDataStarted');
        KBEngine.Event.deregister('onStreamDataRecv', this, 'onStreamDataRecv');
        KBEngine.Event.deregister('onStreamDataCompleted', this, 'onStreamDataCompleted');

    }

    /**
     * 登录
     * @param {*} userName 
     * @param {*} pw 
     * @param {*} data 
     * data 中type:1账号
     * 2：微信正常登录
     * 3：微信快速合建
     * channel,type,code
     * type = 1 普通登录， 2 微信登录
     */
    startGame(userName, pw, data) {
        userName = userName || 'test';
        pw = pw || '123456';
        var datas = {};
        datas = data;
        datas = JSON.stringify(datas);
        KBEngine.Event.fire('login', userName, pw, datas);
    }

    /**
     * 登录服务器回调
     */
    onConnectionState(success) {
        var logStr = '';
        if (!success) {
            logStr = ' Connect(' + KBEngine.app.ip + ':' + KBEngine.app.port + ') is error! (连接错误)';
            ListenerMgr.Instance().emit('kb_login_failed_push');
        } else {
            logStr = 'Connect successfully, please wait...(连接成功，请等候...)';
        }
        console.log(logStr);
    }

    /**
     * 主动关闭游戏
     */
    onDisconnected(msg) {
        cc.log('onDisconnected');
        ListenerMgr.Instance().emit('kb_disConnected_push', '断开连接');
    }

    /**
     *登录失败
    */
    onLoginFailed(failedcode) {
        var logStr = '';
        if (failedcode == 20) {
            logStr = 'Login is failed(登录失败), err=' + KBEngine.app.serverErr(failedcode) + ', ' + KBEngine.app.serverdatas;
        } else {
            logStr = 'Login is failed(登录失败), err=' + KBEngine.app.serverErr(failedcode);
        }
        if (failedcode == 39) {
            //手动登录微信
            cc.sys.localStorage.setItem('wxToken', '');
            ListenerMgr.Instance().emit('kb_login_manual_push');
            return;
        }
        ListenerMgr.Instance().emit('kb_login_failed_push', `登录失败\n${KBEngine.app.serverErrs[failedcode].descr}`);
    }

    /**
     * 登录网关失败
     */
    onLoginBaseappFailed(failedcode) {
        KBEngine.INFO_MSG('LoginBaseapp is failed(登录网关失败), err=' + KBEngine.app.serverErr(failedcode));
        ListenerMgr.Instance().emit('kb_login_failed_push', '登录网关失败');
    }

    /**
     * 登录成功
     */
    recvTestData(msg, hp) {
        console.log('recv appMsg is:', msg, hp);
        // //设置用户数据
        // myG.model.userData.init(); //清除数据
        // myG.model.userData.setUserData(msg);
        // myG.model.playerData.clearData(); //清除数据
        // myG.model.playerData.initWithTable(msg);
        ListenerMgr.Instance().emit('kb_login_success_push');
    }

    onStreamDataStarted(id, datasize, descr) {
        console.log(id, datasize, descr);
        // receive[id] = new Array();
        // receive[id].push();
    }

    onStreamDataRecv(id, data) {
        console.log(id, data);
        // for (let i = 0; i < data.length; i++) {
        //     receive[id].push(data[i]);
        // }
    }

    onStreamDataCompleted(id) {
        console.log(id);
        // let str = Uint8ArrayToString(receive[id]);
        // console.log(str);
    }
} 
