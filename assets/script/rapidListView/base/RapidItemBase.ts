const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidItemBase extends cc.Component {


    protected rapidItemData: RapidItemData = null;

    protected layerArray: cc.Node[] = [];
    private sizeChangeCallFunc: (index: number, itemSize: cc.Size) => {} = null;
    private itemEventCallFunc: (eventName: any, data: any) => {} = null;

    private initLayerArray() {
        if (this.layerArray.length > 0) {
            return;
        }

        for (let i = 0, iLength = this.node.childrenCount; i < iLength; i++) {
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
            node.active = true;
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

    /**
     * @override
     * 作为单个item被移除时播放的动画效果
     * @returns {Promise<any>}
     */
    removeAnimation() {
        return new Promise(resolve => {
            this.layerArray.forEach(element => {
                element.active = false;
            });
            resolve();

            // let actionIndex = 0;
            // this.layerArray.forEach(element => {
            //     element.runAction(cc.sequence(
            //         cc.scaleTo(0.2, 0),
            //         cc.callFunc(() => {
            //             ++actionIndex === this.layerArray.length && resolve();
            //         })
            //     ))
            // })
        })
    }

    changeIndexAnimation() {
        // this.layerArray.forEach(element => {
        //     element.runAction(cc.moveTo(0.2, this.rapidItemData.position));
        // });
        this.updatePosition();
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

