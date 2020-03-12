import { UIComponent } from "../../Utils/UIKiller/UIComponent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIBg extends UIComponent {


    onLoad() {
        //获取运行场景的可见大小。
        let visiSize = cc.view.getVisibleSize();
        this.node.width = visiSize.width;
        this.node.height = visiSize.height;
        this.node.opacity = 155;
        this.node.addComponent(cc.BlockInputEvents);
    }

    start() {

    }

    // update (dt) {}
}
