import RapidScroll from "./logic/RapidScroll";
import RapidData from "./logic/RapidData";
import RapidNodePool from "./logic/RapidNodePool";
import {RapidItemTemplateType, RapidRollDirection, RapidToPositionType} from "./enum/RapidEnum";
import RapidItemBase from "./base/RapidItemBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidListView extends cc.Component {


    // 节点模板
    @property({
        type: cc.Node,
        visible() {
            return this.itemTemplateType === RapidItemTemplateType.NODE;
        }
    })
    protected itemTemplateNode: cc.Node = null;

    // 预制模板
    @property({
        type: cc.Prefab,
        visible() {
            return this.itemTemplateType === RapidItemTemplateType.PREFAB;
        }
    })
    protected itemTemplatePrefab: cc.Prefab = null;

    @property(cc.Enum(RapidItemTemplateType))
    private _itemTemplateType : RapidItemTemplateType = RapidItemTemplateType.NODE;

    @property({
        type: cc.Enum(RapidItemTemplateType),
        tooltip: CC_DEV && "Item模板模式"
    })
    protected set itemTemplateType(val: RapidItemTemplateType) {
        this._itemTemplateType = val;
        this.itemTemplateNode = null;
        this.itemTemplatePrefab = null;
    }
    protected get itemTemplateType(): RapidItemTemplateType {
        return this._itemTemplateType;
    }

    @property(RapidRollDirection)
    private _rollDirectionType: RapidRollDirection = RapidRollDirection.VERTICAL;

    @property({
        type: cc.Enum(RapidRollDirection),
        tooltip: CC_DEV && "列表滚动方向"
    })
    protected set rollDirectionType(val: RapidRollDirection) {
        this._rollDirectionType = val;

        this.updateProperty();
    }
    protected get rollDirectionType(): RapidRollDirection {
        return this._rollDirectionType;
    }

    @property({
        tooltip: CC_DEV && "是否自适应content宽高"
    })
    protected isAdaptionSize: boolean = false;

    private itemEventCallFunc: Function = null;

    public rapidScroll: RapidScroll;
    public rapidData: RapidData;
    public rapidNodePool: RapidNodePool;

    private checkAddLayout() {
        let content = this.node.getComponent(cc.ScrollView).content;
        !content.getComponent(cc.Layout) && content.addComponent(cc.Layout);
    }

    private updateProperty() {
        let isVertical = this.rollDirectionType === RapidRollDirection.VERTICAL;

        let scrollView = this.node.getComponent(cc.ScrollView);
        scrollView.vertical = isVertical;
        scrollView.horizontal = !isVertical;

        let content = scrollView.content;
        content.setAnchorPoint(isVertical ? cc.v2(0.5, 1) : cc.v2(0, 0.5));
        content.setPosition(isVertical ? cc.v2(0, this.node.height / 2) : cc.v2(-this.node.width / 2, 0));
    }

    resetInEditor() {
        this.checkAddLayout();
        this.updateProperty();
    }

    init() {
        this.rapidData = this.node.addComponent(RapidData);
        this.rapidNodePool = this.node.addComponent(RapidNodePool);
        this.rapidScroll = this.node.addComponent(RapidScroll);

        this.rapidData.init(this);
        this.rapidNodePool.init(this);
        this.rapidScroll.init(this);
    }


    updateData(itemDataArray: any[], toPosition: RapidToPositionType) {
        this.rapidData.updateDataArray(itemDataArray);
        this.rapidScroll.updateLayout(toPosition);
    }

    getItemTemplate(): cc.Node | cc.Prefab | any {
        return this.itemTemplateType === RapidItemTemplateType.NODE ? this.itemTemplateNode : this.itemTemplatePrefab;
    }

    getItemTemplateNode(): cc.Node {
        let item = this.getItemTemplate();

        return this.itemTemplateType === RapidItemTemplateType.NODE ? item : item.data;
    }

    getItemTemplateScript(): RapidItemBase {
        let item = this.getItemTemplate();

        return this.itemTemplateType === RapidItemTemplateType.NODE ? item.getComponent(RapidItemBase) : item.data.getComponent(RapidItemBase);
    }

    getRollDirectionType(): RapidRollDirection {
        return this.rollDirectionType;
    }

    getIsAdaptionSize(): boolean {
        return this.isAdaptionSize;
    }

    getItemEvent(): Function {
        return this.itemEventCallFunc;
    }

    scrollToBottom(time: number) {
        this.rapidScroll.scrollToBottom(time);
    }

    addListenItemEvent(callFunc: Function) {
        this.itemEventCallFunc = callFunc;
    }

    // update (dt) {}
}
