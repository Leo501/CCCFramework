


export default class Spawn {

    public static create(): Spawn {
        return new Spawn();
    }

    private spawnArr: cc.FiniteTimeAction[] = [];

    public delay(time: number): Spawn {
        this.spawnArr.push(cc.delayTime(time));
        return this;
    }

    public event(call: Function): Spawn {
        this.spawnArr.push(cc.callFunc(call));
        return this;
    }

    public add(action: cc.ActionInterval) {
        this.spawnArr.push(action);
        return this;
    }

    public action(): cc.ActionInstant {
        return cc.spawn(this.spawnArr);
    }
}
