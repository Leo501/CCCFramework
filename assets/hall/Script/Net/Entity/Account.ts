import { ListenerMgr } from "../../Manage/ListenerManager";

KBEngine.Account = KBEngine.Entity.extend({
    __init__: function () {
        this._super();
        console.log('连接大厅成功');
    },

    /**
     * 禁用帐号
     * @param {*} data 
     */
    onDisableAccountRes(msg) {
        console.log('onDisableAccountRes');
        // cc.emitter.emit('Game_onDisableAccount_push');
        cc.emitter.emit('kb_login_failed_push', `该账号已被封停\n如有疑问请联系客服咨询\n客服电话:${myG.model.playerData.kefu}`);
        //关闭连接
        KBEngine.app.onclose();
    },

    /**
     * 禁用登录
     * @param {*} data 
     */
    onDisableLoginRes(data) {
        console.log('onDisableLoginRes');
        ListenerMgr.Instance().emit('Game_onDisableLogin_push');
    },

    /**
     * 刷新token
     */
    onRefreshTokenRes(token) {
        console.log('onRefreshTokenRes', token);
        let oldToken = cc.sys.localStorage.getItem('wxToken');
        console.log('onRefreshTokenRes oldToken=', oldToken);
        if (token != oldToken) {
            cc.sys.localStorage.setItem('wxToken', token);
            console.log('set token');
        }
    }

});