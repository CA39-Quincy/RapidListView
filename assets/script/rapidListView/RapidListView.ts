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
        let errorTypeIndex = [
            val === cc.Layout.Type.NONE,
            this.rollDirectionType === RapidRollDirection.VERTICAL &&  val === cc.Layout.Type.HORIZONTAL,
            this.rollDirectionType === RapidRollDirection.HORIZONTAL &&  val === cc.Layout.Type.VERTICAL,
        ].indexOf(true);

        if (errorTypeIndex > -1) {
            let warnTipsArray = [
                "不允许选择“NONE”类型！",
                "RollDirectionType为垂直滚动时，不允许选择“HORIZONTAL”排序类型！",
                "RollDirectionType为水平滚动时，不允许选择“VERTICAL”排序类型！",
            ];
            cc.warn("请重新选择Layout Type，" + warnTipsArray[errorTypeIndex]);

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

    @property
    private _isAdaptionSize: boolean = false;
    @property({
        tooltip: CC_DEV && "是否自适应content宽高"
    })
    protected set isAdaptionSize(val: boolean) {
        if (this.layoutType === cc.Layout.Type.GRID) {
            cc.warn("自适应不支持LayoutType为GRID网格布局类型");

            return;
        }
        this._isAdaptionSize = val;
    }

    protected get isAdaptionSize(): boolean {
        return this._isAdaptionSize;
    }

    private itemEventCallFunc: (eventName: any, data: any) => {} = null;
    private getItemDataCallFunc: (index: number) => {} = null;

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

    /**
     * 初始化，仅调用一次
     * @param {(index: number) => {}} getItemDataCallFunc
     */
    init(getItemDataCallFunc?: (index: number) => {}) {
        this.getItemDataCallFunc = getItemDataCallFunc;
        this.itemTemplateNode && (this.itemTemplateNode.active = false);

        this.rapidData = this.node.addComponent(RapidData);
        this.rapidNodePool = this.node.addComponent(RapidNodePool);
        this.rapidScroll = this.node.addComponent(RapidScroll);

        this.rapidData.init(this);
        this.rapidNodePool.init(this);
        this.rapidScroll.init(this);
    }

    /**
     * 更新视图，当数据长度有变化的时候需要调用刷新
     * @param {number} itemCount item数据数组长度
     * @param {number} toOffset 显示在指定的百分比位置，范围值：0~1，不穿参默认为0
     */
    updateView(itemCount: number, toOffset?: number) {
        this.rapidData.updateDataArray(itemCount);
        this.rapidScroll.updateLayout(toOffset);
    }

    // 获取item模板，组件内部调用，外部逻辑不要调用！
    getItemTemplate(): cc.Node | cc.Prefab | any {
        return this.itemTemplateType === RapidItemTemplateType.NODE ? this.itemTemplateNode : this.itemTemplatePrefab;
    }

    // 获取item模板节点，组件内部调用，外部逻辑不要调用！
    getItemTemplateNode(): cc.Node {
        let item = this.getItemTemplate();

        return this.itemTemplateType === RapidItemTemplateType.NODE ? item : item.data;
    }

    // 获取item模板脚本，组件内部调用，外部逻辑不要调用！
    getItemTemplateScript(): RapidItemBase {
        let item = this.getItemTemplate();

        return this.itemTemplateType === RapidItemTemplateType.NODE ? item.getComponent(RapidItemBase) : item.data.getComponent(RapidItemBase);
    }

    // 获取Item监听事件，组件内部调用，外部逻辑不要调用！
    getItemEvent(): (eventName: any, data: any) => {} {
        return this.itemEventCallFunc;
    }

    // 获取Item数据，组件内部调用，外部逻辑不要调用！
    getItemData(index: number) {
        return this.getItemDataCallFunc ? this.getItemDataCallFunc(index) : null;
    }

    // 获取滚动方向类型
    getRollDirectionType(): RapidRollDirection {
        return this.rollDirectionType;
    }

    // 是否为垂直滚动，反之为水平滚动
    getIsVerticalRoll() {
        return this.rollDirectionType === RapidRollDirection.VERTICAL;
    }

    // 是否为正向排序， 正向排序：水平滚动 && 从左到右排序 || 垂直滚动 && 从上到下排序
    getIsPositiveSort() {
        return (this.rollDirectionType === RapidRollDirection.HORIZONTAL && this.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT)
            || (this.rollDirectionType === RapidRollDirection.VERTICAL && this.verticalDirection === cc.Layout.VerticalDirection.TOP_TO_BOTTOM);
    }

    // 是否自适应宽高
    getIsAdaptionSize(): boolean {
        return this.isAdaptionSize;
    }

    /**
     * 滚动到视图百分比位置
     * 起始位置以item为起始方向，offset值为0
     * @param {number} offset 滚动范围值：0~1
     * @param {number} time 滚动到指定位置需要的时间
     */
    scrollToOffset(offset: number, time: number) {
        this.rapidScroll.scrollToOffset(offset, time);
    }

    /**
     * 滚动到指定数组下标item
     * @param {number} index item数组下标
     * @param {number} time 滚动到指定位置需要的时间
     */
    scrollToIndex(index: number, time: number) {
        this.rapidScroll.scrollToIndex(index, time);
    }

    /**
     * 添加item事件监听，调用事件回调：RapidItemBase.onItemEvent()
     * eventName: 事件名称
     * data: 数据
     * @param {(eventName: any, data: any) => {}} callFunc
     */
    addListenItemEvent(callFunc: (eventName: any, data: any) => {}) {
        this.itemEventCallFunc = callFunc;
    }
}
