import RapidLayout from "./RapidLayout";
import RapidData from "./RapidData";
import RapidNodePool from "./RapidNodePool";
import {RapidItemTemplateType, RapidRollDirection, RapidToPositionType} from "../enum/RapidEnum";
import RapidItemBase from "../base/RapidItemBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidScrollView extends cc.Component {

    @property({
        type: cc.Enum(RapidItemTemplateType),
        toolTip: CC_DEV && "Item模板模式"
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

    @property({
        type: cc.Enum(RapidRollDirection),
        toolTip: CC_DEV && "列表滚动方向"
    })
    protected rollDirectionType: RapidRollDirection = RapidRollDirection.VERTICAL;

    public rapidLayout: RapidLayout;
    public rapidData: RapidData;
    public rapidNodePool: RapidNodePool;

    init() {
        this.rapidData = this.node.addComponent(RapidData);
        this.rapidNodePool = this.node.addComponent(RapidNodePool);
        this.rapidLayout = this.node.addComponent(RapidLayout);

        this.rapidData.init(this);
        this.rapidNodePool.init(this);
        this.rapidLayout.init(this);
    }


    updateData(itemDataArray: any[], toPosition: RapidToPositionType) {
        this.rapidData.updateDataArray(itemDataArray);
        this.rapidLayout.updateLayout(toPosition);
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
