import RapidScroll from "./logic/RapidScroll";
import RapidData from "./logic/RapidData";
import RapidNodePool from "./logic/RapidNodePool";
import {RapidItemTemplateType, RapidRollDirection, RapidToPositionType} from "./enum/RapidEnum";
import RapidItemBase from "./base/RapidItemBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidListView extends cc.Component {

    @property({type: cc.Float})
    private _anchorX: number = 0.5;
    @property
    protected set anchorX(val: number) {
        this._anchorX = val;
        this.updateAnchor();
    }

    protected get anchorX(): number {
        return this._anchorX;
    }


    @property({type: cc.Float})
    private _anchorY: number = 0.5;
    @property
    protected set anchorY(val: number) {
        this._anchorY = val;
        this.updateAnchor();
    }

    protected get anchorY(): number {
        return this._anchorY;
    }

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
    private _itemTemplateType: RapidItemTemplateType = RapidItemTemplateType.NODE;
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


    @property(cc.Layout.Type)
    private _layoutType: cc.Layout.Type = cc.Layout.Type.VERTICAL;
    @property({
        type: cc.Enum(cc.Layout.Type),
        tooltip: CC_DEV && "item排序类型，不允许选择“NONE”类型"
    })
    protected set layoutType(val: cc.Layout.Type) {
        if (val === cc.Layout.Type.NONE) {
            cc.warn("请重新选择Layout Type，不允许选择“NONE”类型！！！");

            return;
        }
        this._layoutType = val;
        this.updateProperty();
    }

    protected get layoutType(): cc.Layout.Type {
        return this._layoutType;
    }

    @property(cc.Layout.VerticalDirection)
    private _verticalDirection: cc.Layout.VerticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
    @property({
        type: cc.Enum(cc.Layout.VerticalDirection),
        tooltip: CC_DEV && "item纵向排序方向，约束从上到下正向，反之为逆向",
        visible() {
            return this.layoutType === cc.Layout.Type.VERTICAL || this.layoutType === cc.Layout.Type.GRID;
        }
    })
    protected set verticalDirection(val: cc.Layout.VerticalDirection) {
        this._verticalDirection = val;
        this.updateProperty();
    }

    protected get verticalDirection(): cc.Layout.VerticalDirection {
        return this._verticalDirection;
    }


    @property(cc.Layout.HorizontalDirection)
    private _horizontalDirection: cc.Layout.HorizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
    @property({
        type: cc.Enum(cc.Layout.HorizontalDirection),
        tooltip: CC_DEV && "item横向排序方向，约束从左到右为正向，反之为逆向",
        visible() {
            return this.layoutType === cc.Layout.Type.HORIZONTAL || this.layoutType === cc.Layout.Type.GRID;
        }
    })
    protected set horizontalDirection(val: cc.Layout.HorizontalDirection) {
        this._horizontalDirection = val;
        this.updateProperty();
    }

    protected get horizontalDirection(): cc.Layout.HorizontalDirection {
        return this._horizontalDirection;
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
        // 是否垂直滚动
        let isVerticalRoll = this.getIsVerticalRoll();
        // 是否正向排序
        let isPositiveSort = this.getIsPositiveSort();

        let scrollView = this.node.getComponent(cc.ScrollView);
        scrollView.vertical = isVerticalRoll;
        scrollView.horizontal = !isVerticalRoll;

        let content = scrollView.content;
        content.setAnchorPoint(isVerticalRoll ? cc.v2(0.5, isPositiveSort ? 1 : 0) : cc.v2(isPositiveSort ? 0 : 1, 0.5));

        let offsetPos: number;
        if (isVerticalRoll) {
            offsetPos = isPositiveSort ? this.node.height - this.node.height * this.node.anchorY : -this.node.height * this.node.anchorY;
        }
        else {
            offsetPos = isPositiveSort ? this.node.width * (0 - this.node.anchorX) : this.node.width - this.node.width * this.node.anchorX;
        }
        content.setPosition(isVerticalRoll ? cc.v2(0, offsetPos) : cc.v2(offsetPos, 0));

        let layout: cc.Layout = content.getComponent(cc.Layout);
        layout.type = this.layoutType;
        layout.verticalDirection = this.verticalDirection;
        layout.horizontalDirection = this.horizontalDirection;
    }

    private updateAnchor() {
        let view = this.node.getChildByName("view");

        if (!view) {
            cc.error("获取不到命名为“view”的包含Mask组件子节点, 请勿重命名view");

            return;
        }

        this.node.setAnchorPoint(cc.v2(this.anchorX, this.anchorY));
        view.setAnchorPoint(cc.v2(this.anchorX, this.anchorY));

        this.updateProperty();
    }

    resetInEditor() {
        this.checkAddLayout();
        this.updateProperty();
    }

    init() {
        this.itemTemplateNode && (this.itemTemplateNode.active = false);

        this.rapidData = this.node.addComponent(RapidData);
        this.rapidNodePool = this.node.addComponent(RapidNodePool);
        this.rapidScroll = this.node.addComponent(RapidScroll);

        this.rapidData.init(this);
        this.rapidNodePool.init(this);
        this.rapidScroll.init(this);
    }


    updateData(itemDataArray: any[], toPositionType: RapidToPositionType) {
        this.rapidData.updateDataArray(itemDataArray);
        this.rapidScroll.updateLayout(toPositionType);
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

    getIsVerticalRoll() {
        return this.rollDirectionType === RapidRollDirection.VERTICAL;
    }

    getIsPositiveSort() {
        return (this.rollDirectionType === RapidRollDirection.HORIZONTAL && this.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT)
            || (this.rollDirectionType === RapidRollDirection.VERTICAL && this.verticalDirection === cc.Layout.VerticalDirection.TOP_TO_BOTTOM);
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

    scrollToOffset(offset: number, time: number) {
        this.rapidScroll.scrollToOffset(offset, time);
    }

    addListenItemEvent(callFunc: Function) {
        this.itemEventCallFunc = callFunc;
    }
}
