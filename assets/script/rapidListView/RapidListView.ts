import RapidScroll from "./logic/RapidScroll";
import RapidData from "./logic/RapidData";
import RapidNodePool from "./logic/RapidNodePool";
import {RapidItemTemplateType, RapidRollDirection, RapidToPositionType} from "./enum/RapidEnum";
import RapidItemBase from "./base/RapidItemBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidListView extends cc.Component {

    @property({
        type: cc.Enum(RapidItemTemplateType),
        tooltip: CC_DEV && "Item模板模式"
    })
    protected itemTemplateType: RapidItemTemplateType = RapidItemTemplateType.NODE;

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

    @property(RapidRollDirection)
    private _rollDirectionType: RapidRollDirection = RapidRollDirection.VERTICAL;

    @property({
        type: cc.Enum(RapidRollDirection),
        tooltip: CC_DEV && "列表滚动方向"
    })
    protected set rollDirectionType(val: RapidRollDirection) {
        this._rollDirectionType = val;

        let scrollView = this.node.getComponent(cc.ScrollView);
        scrollView.vertical = val === RapidRollDirection.VERTICAL;
        scrollView.horizontal = val === RapidRollDirection.HORIZONTAL;
    }
    protected get rollDirectionType(): RapidRollDirection {
        return this._rollDirectionType;
    }

    public rapidScroll: RapidScroll;
    public rapidData: RapidData;
    public rapidNodePool: RapidNodePool;


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

    // update (dt) {}
}
