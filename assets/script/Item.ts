
import RapidItemBase from "./rapidListView/base/RapidItemBase";
import {RankData} from "./TestData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends RapidItemBase {

    @property(cc.Label)
    rank: cc.Label = null;

    @property(cc.Label)
    pos: cc.Label = null;

    @property(cc.RichText)
    text: cc.RichText = null;

    @property(cc.Label)
    text2: cc.Label = null;

    @property(cc.Node)
    chat: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onShow() {
        let data: RankData = this.rapidItemData.itemData.text;
        // this.text2.node.on(cc.Node.EventType.SIZE_CHANGED, this.onText2SizeChange, this);

        this.text.string = data.text;
        this.text2.string = data.text;
        this.rank.string = this.getIndex() + "";

        let itemWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        this.pos.string = `${Math.ceil(itemWorldPos.x)},${Math.ceil(itemWorldPos.y)}`;
        this.chat.getComponent(cc.Layout).updateLayout();

        this.node.height = this.chat.height;
        this.onSizeChange();

        // this.node.height = this.text2.node.height;
        // this.onSizeChange();
    }

    onHide() {
        // this.text2.node.off(cc.Node.EventType.SIZE_CHANGED, this.onText2SizeChange, this);
    }

    onText2SizeChange() {
        this.node.height = this.text2.node.height;
        cc.log(this.getIndex(), this.node.height, this.text2.node.height);
        this.onSizeChange();
    }

    // update (dt) {}
}
