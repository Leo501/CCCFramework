export interface ConfigContainerClass<T extends BaseConfigContainer>
{
    new (): T;
}

export abstract class BaseConfigContainer 
{
    protected static className = "BaseUI";

    protected mTag: any;
    public get tag(): any
    {
        return this.mTag;
    }
    public set tag(value: any)
    {
        this.mTag = value;
    }
}