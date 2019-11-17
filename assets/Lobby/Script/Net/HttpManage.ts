import GameConfig from "../GameGonfig";

/**
 * 返回是否合法
 * @param {*} response 
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        // console.log();
        throw error;
    }
}

/**
 * 返回一个Json数据
 * @param {*} response 
 */
function parseJSON(response) {
    return response.json();
}

/**
 * 设置Then
 * @param {*} fetch 
 * @param {*} handler 
 */
function setThen(fetch, success, error) {

    try {
        fetch.then(checkStatus)
            .then(parseJSON)
            .then(function (json) {
                // console.log('parsed json', json);
                if (success) success(json);
            }).catch(function (ex) {
                // console.log('parsing failed', ex);
                if (error) error(ex);
            });
    } catch (err) {
        console.log('setThen error=', err);
        if (error) error(err);
    }
}

export interface ReqOption {
    url: string,
    path: string,
    type: string,//GET POST
    data: object,//params
}

export class HttpMgr {
    private static instance: HttpMgr = new HttpMgr();

    public static Instance() {
        // if (this.instance == null) {
        //     this.instance = new HttpMgr();
        // }
        return this.instance;
    }

    /**
     * 发送http命令
     */
    private sendRequest(option = {}) {
        // console.log('http =', option);
        let path = option['path'];
        let data = option['data'] || {};
        let type = option['type'] || 'GET';
        let url = option['url'] || GameConfig.getWebUrl();
        let onSuccess = option['success'] || ((data) => { console.log('receive data', data) });
        let onError = option['error'] || ((data) => { console.log('err data', data) });

        if (type == 'GET') {
            let sendtext = '?';
            for (var k in data) {
                if (sendtext != '?') {
                    sendtext += '&';
                }
                sendtext += (k + '=' + data[k]);
            }
            let requestURL = url + path + encodeURI(sendtext);
            console.log('requestURL=', requestURL);
            setThen(fetch(requestURL), onSuccess, onError);
        } else if (type == 'POST') {
            setThen(fetch(url + path, {
                method: type,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }), onSuccess, onError);
        }
    }

    /**
     * 
     * @param {*} opt 
     * @param {*} onSuccess 
     * @param {*} onError 
    //  * @param {*} onTimeout 
     */
    request(opt: ReqOption, onSuccess: Function, onError: Function, isLoading?) {

        let loading = null;
        //显示等待
        if (isLoading) {
            // loading = myG.ui.loadingAnim({
            //     msg: '请求中...'
            // });
        }
        //重连次数
        let tryTime = 0;
        //是否已收到结果，用于发送两次，收到两次的情况
        let isReci = false;
        let getAuthCb = function (data) {
            // console.log(this, data);
            if (isReci) return;
            isReci = true;
            if (isLoading) {
                loading && loading.script.close();
            }
            if (onSuccess) onSuccess(data);
        };
        let getAuthErrCb = function (data) {
            // console.log(this, data);
            if (isReci) return;
            isReci = true;
            if (isLoading) {
                loading && loading.script.close();
            }
            if (onError) onError(data);
        };
        opt.success = getAuthCb;
        opt.error = getAuthErrCb;

        let intervalId = 0;
        let retryFunc = function () {
            if (isReci) {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = 0;
                }
                return;
            }
            if (++tryTime >= 2) {
                isReci = true;
                if (isLoading) {
                    loading && loading.script.close();
                }
                if (onError) onError('time out');
                clearInterval(intervalId);
                intervalId = 0;
                return;
            }
            this.sendRequest(opt);
        }.bind(this);
        this.sendRequest(opt);
        intervalId = setInterval(() => {
            retryFunc();
        }, 7000);
    }

}
