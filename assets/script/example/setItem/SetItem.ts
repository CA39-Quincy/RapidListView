import RapidItemBase from "../../rapidListView/base/RapidItemBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SetItem extends RapidItemBase {

    @property(cc.Label)
    indexLab: cc.Label = null;

    onShow(data) {
        this.indexLab.string = String(data.num);
    }
}
