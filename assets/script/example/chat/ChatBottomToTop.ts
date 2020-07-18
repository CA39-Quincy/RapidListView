import RapidListView from "../../rapidListView/RapidListView";
import {RapidToPositionType} from "../../rapidListView/enum/RapidEnum";
import {ChatData, ChatTargetType} from "./ChatConst";

const CHAT_ARRAY = [
    "<img src='37'/><img src='37'/><img src='37'/>",
    "<img src='06'/>",
    "<color=#cc6600>循环列表</color>",
    "<color=#cc6600>循环列表</color><color=#66ffcc>RapidListViewRapidListViewRapidListView\n</color><size=40><color=#66ffcc>循环列表</color></size>",
    "<color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color>",
    "<color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color>",
];

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatBottomToTop extends cc.Component {

    @property(RapidListView)
    chatRapidListView: RapidListView = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.ChatBottom = this;

        this.chatRapidListView.init();

        let chatArray = [];
        while (chatArray.length < 50) {

            let data = {
                type: chatArray.length % 5 === 0 ? ChatTargetType.TIME : this.getRandom(1, 2),
                text: chatArray.length % 5 === 0 ? new Date().toLocaleTimeString() : CHAT_ARRAY[this.getRandom(0, CHAT_ARRAY.length - 1)]
            } as ChatData;

            chatArray.push(data);
        }
        this.chatRapidListView.updateData(chatArray, RapidToPositionType.TOP);
    }

    start () {

    }

    getRandom(min, max) {

        return Math.floor((Math.random() * (max - min + 1) + min));
    }

    onBtnToBottom() {
        this.chatRapidListView.rapidScroll.scrollToBottom(0.5);
    }

    // update (dt) {}
}
