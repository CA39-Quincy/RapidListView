
const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidItemBase extends cc.Component {

    @property(cc.Node)
    protected layerArray: cc.Node[] = [];

    protected rapidItemData: RapidItemData = null;

    sizeChangeCallFunc: Function = null;

    protected onSizeChange() {
        this.sizeChangeCallFunc && this.sizeChangeCallFunc(this.rapidItemData.index, this.node.getContentSize());
    }

    protected onShow() {

    }

    protected onHide() {

    }

    show(itemData: RapidItemData, layerParentArray: cc.Node[]) {
        this.rapidItemData = itemData;

        for(let i = 0; i < layerParentArray.length; i++) {
            let node = i === 0 ? this.node : this.layerArray[i];
            node.parent = layerParentArray[i];
            node.setPosition(itemData.position);
        }

        this.onShow();
    }

    hide() {
        for(let i = 1; i < this.layerArray.length; i++) {
            this.layerArray[i].parent = this.node;
        }

        this.sizeChangeCallFunc = null;
        this.onHide();
    }

    updatePosition(itemData: RapidItemData) {
        this.rapidItemData = itemData;
        for(let i = 0; i < this.layerArray.length; i++) {
            let node = i === 0 ? this.node : this.layerArray[i];
            node.setPosition(itemData.position);
        }
    }

    getLayerArray(): cc.Node[] {
        return this.layerArray;
    }

    getPostion()  {
        this.node.getPosition();
    }

    getIndex(): number {
        return this.rapidItemData.index;
    }

    addListenSizeChange(callFunc: Function) {
        this.sizeChangeCallFunc = callFunc;
    }
}

