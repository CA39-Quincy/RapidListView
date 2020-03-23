
const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidItemBase extends cc.Component {

    @property(cc.Node)
    protected layerArray: cc.Node[] = [];

    protected rapidItemData: RapidItemData = null;



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

        this.onHide();
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
}

