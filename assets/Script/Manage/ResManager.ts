

export let resGetPrefab=function (url): Promise<cc.Prefab> {
    console.log('getPrefab');
    let p = new Promise<cc.Prefab>((resolve, reject) => {
        cc.loader.loadRes(url, (e, prefab) => {
            console.log('loadRes',url);
            if (e) {
                reject(e);
            } else {
                resolve(prefab);
            }
        });
    });
    return p;
}