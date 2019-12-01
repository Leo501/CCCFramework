import GameConfig from "../GameGonfig";
import fetch = require('fetch');
export interface ReqOption {
    url: string,
    path: string,
    type: string,//GET POST
    data: object,//params

    success: Function,
    error: Function

}

/**
 * 使用Fecth来进行http通信
 * Fetch 文档 https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
 */
export class HttpMgr {
    private static instance: HttpMgr = new HttpMgr();

    public static Instance() {
        return this.instance;
    }

    private defaultUrl: string;

    constructor() {
        this.defaultUrl = GameConfig.getWebUrl();
    }

    /**
     * 返回是否合法
     * @param {*} response 
     */
    private checkStatus(response) {
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
    private parseJSON(response) {
        return response.json();
    }

    /**
     * 设置Then
     * @param {*} fetch 
     * @param {*} handler 
     */
    private setThen(fetch, success, error) {
        try {
            fetch.then(this.checkStatus)
                .then(this.parseJSON)
                .then(function (json) {
                    success && success(json);
                }).catch(function (ex) {
                    error && error(ex);
                });
        } catch (err) {
            console.log('setThen error=', err);
            if (error) error(err);
        }
    }

    /**
     * 发送http命令
     */
    private sendRequest(option = {}) {
        let path = option['path'];
        let data = option['data'] || {};
        let type = option['type'] || 'GET';
        let url = option['url'] || this.defaultUrl;
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
            this.setThen(fetch(requestURL), onSuccess, onError);
        } else if (type == 'POST') {
            this.setThen(fetch(url + path, {
                method: type,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }), onSuccess, onError);
        }
    }

    public request(opt: ReqOption): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {
            let tryTime = 3, reciveTime = 0;
            opt.success = (data) => {
                if (reciveTime++ > 1) return;
                resolve(data);
            }
            opt.error = (data) => {
                if (reciveTime++ > 1) return;
                reject(data);
            }
            let intervalId = this.createTimeout(() => {
                if (tryTime-- == 0) {
                    clearInterval(intervalId);
                }
                this.sendRequest(opt);
            });
            this.sendRequest(opt);

        });
    }

    private createTimeout(fn: Function, time: number = 8000): number {
        return setInterval(() => {
            fn && fn();
        }, time);
    }

}
