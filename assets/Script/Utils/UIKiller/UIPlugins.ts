import { AudioMgr } from "../../Manage/AudioManager";
import { ConstValue } from "../../Data/ConstValue";
import { UIComponent } from "./UIComponent";

const UIKillerTouchSound = {
    name: 'UIKillerTouchSound',
    /**
     * 
     * @param {*} node 
     * @param {*} event 
     * @param {*} hasEventFunc 
     * @param {*} eventResult 
     */
    onAfterHandleEvent(node, event, hasEventFunc, eventResult) {
        if (event.type !== cc.Node.EventType.TOUCH_END || eventResult === false) {
            return;
        }
        AudioMgr.Instance().playSound(ConstValue.BTN_CLICK);
    }
};
console.log('UIPlugins');
UIComponent.registerPlugin(UIKillerTouchSound);