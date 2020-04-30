import RapidListView from "../../rapidListView/RapidListView";
import {RapidToPositionType} from "../../rapidListView/enum/RapidEnum";

const CHAT_LIST = [
    {
        text: "<color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },

    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#cc6600>循环列表</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },
    {
        text: "<color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color>"
    },
    {
        text: "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>"
    },

];

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatTopToBottom extends cc.Component {

    @property(RapidListView)
    chatRapidListView: RapidListView = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.Chat = this;

        this.chatRapidListView.init();
        this.chatRapidListView.updateData(CHAT_LIST, RapidToPositionType.TOP);

    }

    start () {

    }

    // update (dt) {}
}
