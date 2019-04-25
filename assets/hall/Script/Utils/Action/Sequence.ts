


export default class Sequence {

    public static create(): Sequence {
        return new Sequence();
    }

    private sequenArr: cc.FiniteTimeAction[] = [];

    /**
     * 
     * @param time 单位-秒
     */
    public delay(time: number): Sequence {
        this.sequenArr.push(cc.delayTime(time));
        return this;
    }

    /**
     * 
     * @param call function
     */
    public event(call: Function): Sequence {
        this.sequenArr.push(cc.callFunc(call));
        return this;
    }

    /**
     * 
     * @param action 其他动作
     */
    public add(action: cc.ActionInterval) {
        this.sequenArr.push(action);
        return this;
    }

    /**
     * 返回实例结果 sequence
     */
    public action(): cc.ActionInterval {
        return cc.sequence(this.sequenArr);
    }

}
