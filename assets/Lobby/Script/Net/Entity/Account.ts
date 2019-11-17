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
             console.log('set token');
        }
    }

});