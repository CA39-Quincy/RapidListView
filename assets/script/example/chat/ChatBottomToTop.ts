import RapidListView from "../../rapidListView/RapidListView";
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

    private chatArray: any[];

    onLoad () {
        window.ChatBottom = this;

        this.chatArray = [];
        while (this.chatArray.length < 50) {

            let data = {
                type: this.chatArray.length % 5 === 0 && this.chatArray.length !== 0 ? ChatTargetType.TIME : this.getRandom(1, 2),
                text: this.chatArray.length % 5 === 0 && this.chatArray.length !== 0 ? new Date().toLocaleTimeString() : CHAT_ARRAY[this.getRandom(0, CHAT_ARRAY.length - 1)]
            } as ChatData;

            this.chatArray.push(data);
        }
        this.chatArray[0].text = CHAT_ARRAY[5];
        this.chatRapidListView.init(index => {
            return this.chatArray[index];
        });
    }

    onEnable() {
        this.chatRapidListView.updateView(50, 0);
    }

    getRandom(min, max) {

        return Math.floor((Math.random() * (max - min + 1) + min));
    }

    onBtnToBottom() {
        this.chatRapidListView.scrollToOffset(1, 0.5);
    }

    onBtnAddNewMsg() {
        let ran = this.getRandom(0, 5);
        let data = {
            type: ran % 5 === 0 ? ChatTargetType.TIME : this.getRandom(1, 2),
            text: ran % 5 === 0 ? new Date().toLocaleTimeString() : CHAT_ARRAY[this.getRandom(0, CHAT_ARRAY.length - 1)]
        } as ChatData;

        this.chatArray.splice(0, 0, data);
        this.chatRapidListView.addItem(0);
    }

    // update (dt) {}
}
