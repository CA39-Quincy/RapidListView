import RapidItemBase from "../../rapidListView/base/RapidItemBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuItem extends RapidItemBase {

    @property(cc.Label)
    text: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onShow (itemData) {
        this.node.on("click", this.onClick, this);
        this.text.string = itemData.text;
    }

    onHide() {
        this.node.off("click", this.onClick, this);
    }

    onClick() {
        this.onItemEvent("buttonClick", this.getIndex());
    }

    // update (dt) {}
}
