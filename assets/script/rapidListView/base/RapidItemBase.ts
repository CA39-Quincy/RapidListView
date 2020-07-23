const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidItemBase extends cc.Component {


    protected rapidItemData: RapidItemData = null;

    protected layerArray: cc.Node[] = [];
    private sizeChangeCallFunc: (index: number, itemSize: cc.Size) => {} = null;
    private itemEventCallFunc: (eventName: any, data: any) => {} = null;

    private initLayerArray() {
        if(this.layerArray.length > 0) {
            return;
        }

        for(let i = 0, iLength = this.node.childrenCount; i < iLength; i++) {
            this.layerArray.push(i === 0 ? this.node : this.node.children[i]);
        }
    }

    protected onSizeChange() {
        this.sizeChangeCallFunc && this.sizeChangeCallFunc(this.rapidItemData.index, this.node.getContentSize());
    }

    protected onItemEvent(eventName: any, data: any) {
        this.itemEventCallFunc && this.itemEventCallFunc(eventName, data);
    }

    protected onShow(itemData: any) {

    }

    protected onHide() {

    }

    show(rapidItemData: RapidItemData, itemData: any, layerParentArray: cc.Node[], eventCallFunc: (eventName: any, data: any) => {}) {
        this.initLayerArray();

        for (let i = 0; i < layerParentArray.length; i++) {
            let node = this.layerArray[i];
            node.parent = layerParentArray[i];
            node.setPosition(rapidItemData.position);
        }

        this.rapidItemData = rapidItemData;
        this.itemEventCallFunc = eventCallFunc;
        this.onShow(itemData);
    }

    hide() {
        for (let i = 1; i < this.layerArray.length; i++) {
            this.layerArray[i].parent = this.node;
        }

        this.onHide();
        this.sizeChangeCallFunc = null;
        this.itemEventCallFunc = null;
        this.rapidItemData = null;
    }

    updatePosition() {
        for (let i = 0; i < this.layerArray.length; i++) {
            let node = i === 0 ? this.node : this.layerArray[i];
            node.setPosition(this.rapidItemData.position);
        }
    }

    getLayerCount(): number {
        return this.node.childrenCount;
    }

    getPostion() {
        this.node.getPosition();
    }

    getIndex(): number {
        return this.rapidItemData.index;
    }

    addListenSizeChange(callFunc: Function) {
        this.sizeChangeCallFunc = callFunc;
    }
}

