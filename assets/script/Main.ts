import RapidScrollView from "./rapidScrollView/logic/RapidScrollView";
import {RankData} from "./TestData";
import {RapidToPositionType} from "./rapidScrollView/enum/RapidEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(RapidScrollView)
    rapidScrollView: RapidScrollView = null;

    @property(cc.ScrollView)
    testScrollView: cc.ScrollView = null;

    @property(cc.Node)
    addItem: cc.Node = null;

    private rankArray: RankData[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.mainScene = this;

        this.addItem.on("click", this.onClickAddItem, this);

        this.rapidScrollView.init();

        let i = 1, len = 21;

        while (i < len) {
            this.rankArray.push(this.createRankData(i));

            i++;
        }

        this.rapidScrollView.updateData(this.rankArray, RapidToPositionType.TOP);
    }

    createRankData(index): RankData {

        return {
            rank: index,
            name: "玩家" + index,
            iconPath: "",
        } as RankData;
    }

    start () {
        this.updateItemIndex();
    }

    onClickAddItem() {
        this.addContentChild();
    }

    addContentChild() {
        let content = this.testScrollView.content;
        let node = cc.instantiate(content.children[0]);
        content.addChild(node);


        this.updateItemIndex();
    }

    updateItemIndex() {
        this.testScrollView.stopAutoScroll();
        this.testScrollView.scrollToBottom();

        let itemArray = this.testScrollView.content.children;

        itemArray.forEach((element, index) => {
            element.getChildByName("Label").getComponent(cc.Label).string = index + "";
        })
    }

    // update (dt) {}
}
