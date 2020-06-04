import RapidItemBase from "../../rapidListView/base/RapidItemBase";
import {ChatData, ChatTargetType} from "./ChatConst";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatItem extends RapidItemBase {

    @property(cc.RichText)
    content: cc.RichText = null;

    @property(cc.Node)
    timeBg: cc.Node = null;

    @property(cc.Label)
    timeText: cc.Label = null;

    @property(cc.Sprite)
    head: cc.Sprite = null;

    @property(cc.Node)
    chatBg: cc.Node = null;

    private bgInitialSize: cc.Size;

    private bgInitialX: number;
    private headInitialX: number;
    private adaptiveHeight: number;
    private nodeInitialHeight: number;
    private contentInitialHeight: number;
    private contentInitialX: number;

    private isInit: boolean = false;

    init() {
        this.isInit = true;
        this.nodeInitialHeight = this.node.height;
        this.headInitialX = this.head.node.x;
        this.bgInitialSize = this.chatBg.getContentSize();
        this.bgInitialX = this.chatBg.x;
        this.contentInitialHeight = this.content.node.height;
        this.contentInitialX = this.content.node.x;
        let contentWidget = this.content.node.getComponent(cc.Widget);
        this.adaptiveHeight = this.node.height - contentWidget.top;
    }

    onShow() {
        !this.isInit && this.init();

        let itemData: ChatData = this.rapidItemData.itemData;

        for(let i = 0, iLength = this.layerArray.length; i < iLength; i++) {
            this.layerArray[i].getChildByName("Time").active = itemData.type === ChatTargetType.TIME;
            this.layerArray[i].getChildByName("Chat").active = itemData.type !== ChatTargetType.TIME;
        }

        if(itemData.type === ChatTargetType.TIME) {
            this.timeText.string = itemData.text;
            this.updateSize(this.timeBg.height);

            return;
        }

        this.content.string = itemData.text;

        this.head.node.x = itemData.type === ChatTargetType.OTHER ? this.headInitialX : -this.headInitialX;
        this.chatBg.scaleX = itemData.type === ChatTargetType.OTHER ? 1 : -1;
        this.chatBg.x = itemData.type === ChatTargetType.OTHER ? this.bgInitialX : -this.bgInitialX;

        let chatBgEnlargeWidth = 56;
        let chatBgWidth = this.content.maxWidth + chatBgEnlargeWidth;

        if(this.content._lineCount === 1) {
            let nodeArray = this.content.node.children;
            chatBgWidth = chatBgEnlargeWidth;

            for(let i = 0; i < nodeArray.length; i++) {
                chatBgWidth += nodeArray[i].width;
            }
        }

        this.content.node.x = this.content._lineCount === 1 && itemData.type === ChatTargetType.SELF ?
            this.contentInitialX + this.bgInitialSize.width - chatBgWidth -12 : this.contentInitialX;

        let newHeightDiffer = this.content.node.height - this.contentInitialHeight;
        this.chatBg.setContentSize(chatBgWidth, this.bgInitialSize.height + newHeightDiffer);

        this.updateSize(this.nodeInitialHeight + newHeightDiffer);
    }

    private updateSize(height: number) {
        this.node.height = height;
        this.rapidItemData.size = this.node.getContentSize();

        this.onSizeChange();
    }
}
