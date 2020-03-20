
import RapidItemBase from "./rapidScrollView/base/RapidItemBase";
import {RankData} from "./TestData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends RapidItemBase {

    @property(cc.Label)
    rank: cc.Label = null;

    @property(cc.Label)
    pos: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onShow() {
        let data: RankData = this.rapidItemData.itemData;
        this.rank.string = this.getIndex() + "";
        let itemWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        this.pos.string = `${Math.ceil(itemWorldPos.x)},${Math.ceil(itemWorldPos.y)}`
    }

    // update (dt) {}
}
