import RapidListView from "./rapidListView/RapidListView";
import {RankData} from "./TestData";
import {RapidToPositionType} from "./rapidListView/enum/RapidEnum";

const CHAT_LIST = [
    {
        text: "循环列表"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "RapidListView<color=#cc6600>循环列表</color>RapidListViewRapidListViewRapidListView\n<size=40><color=#66ffcc>循环列表</color></size>"
    },

];

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(RapidListView)
    rapidListView: RapidListView = null;

    @property(cc.ScrollView)
    testScrollView: cc.ScrollView = null;

    @property(cc.Node)
    addItem: cc.Node = null;

    private rankArray: RankData[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.mainScene = this;

        this.addItem.on("click", this.onClickAddItem, this);

        this.rapidListView.init();

        let i = 0, len = CHAT_LIST.length;

        while (i < len) {
            this.rankArray.push(this.createRankData(i));

            i++;
        }

        this.rapidListView.updateData(this.rankArray, RapidToPositionType.TOP);
    }

    createRankData(index): RankData {

        return {
            rank: index,
            name: "玩家" + index,
            text: CHAT_LIST[index],
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
