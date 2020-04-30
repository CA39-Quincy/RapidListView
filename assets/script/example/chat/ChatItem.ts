import RapidItemBase from "../../rapidListView/base/RapidItemBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatItem extends RapidItemBase {

    @property(cc.RichText)
    content: cc.RichText = null;

    @property(cc.Node)
    chatBg: cc.Node = null;

    private adaptiveHeight: number = 0;
    private nodeInitialHeight: number = 0;
    private bgInitialHeight: number = 0;
    private contentInitialHeight: number = 0;

    private isInit: boolean = false;

    init() {
        this.isInit = true;
        this.nodeInitialHeight = this.node.height;
        this.bgInitialHeight = this.chatBg.height;
        this.contentInitialHeight = this.content.node.height;
        let contentWidget = this.content.node.getComponent(cc.Widget);
        this.adaptiveHeight = this.node.height - contentWidget.top;
    }

    onShow() {
        !this.isInit && this.init();

        this.content.string = this.rapidItemData.itemData.text;
        let newHeightDiffer = this.content.node.height - this.contentInitialHeight;
        this.node.height = this.nodeInitialHeight + newHeightDiffer;
        this.chatBg.height = this.bgInitialHeight + newHeightDiffer;
        this.rapidItemData.size = this.node.getContentSize();

        this.onSizeChange();
    }
}
