

export let resGetPrefab = function (url: string): Promise<cc.Prefab> {
    console.log('getPrefab');
    let p = new Promise<cc.Prefab>((resolve, reject) => {
        cc.loader.loadRes(url, (e, prefab) => {
            console.log('loadRes', url);
            if (e) {
                reject(e);
            } else {
                resolve(prefab);
            }
        });
    });
    return p;
}

export let loadImage = function (url: string, type?: string) {
    console.log('loadImage');
    let p = new Promise<cc.SpriteFrame>((resolve, reject) => {
        console.log("load image ");
        cc.loader.load({
            url: url,
            type: type ? type : "jpg"
        }, (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            let spriteFrame = new cc.SpriteFrame(data, cc.rect(0, 0, data.width, data.height));
            resolve(spriteFrame);
        });
    });
}