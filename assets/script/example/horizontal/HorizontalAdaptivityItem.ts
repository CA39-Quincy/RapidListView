import RapidItemBase from "../../rapidListView/base/RapidItemBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HorizontalAdaptivityItem extends RapidItemBase {
    @property(cc.Label)
    indexLab: cc.Label = null;

    onShow() {
        this.indexLab.string = String(this.rapidItemData.index);

        this.node.width = Math.floor(Math.random() * 80 + 40);
        this.onSizeChange();
    }
}
