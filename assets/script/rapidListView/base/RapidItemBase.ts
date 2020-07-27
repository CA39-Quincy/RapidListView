const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidItemBase extends cc.Component {


    protected rapidItemData: RapidItemData = null;
    protected layerArray: cc.Node[] = [];

    private sizeChangeCallFunc: (index: number, itemSize: cc.Size) => {} = null;
    private itemEventCallFunc: (eventName: any, data: any) => {} = null;

    onDestroy() {
        this.hide();
    }

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
            this.layerArray[i].stopAllActions();
            this.layerArray[i].parent = this.node;
        }

        this.onHide();
        this.sizeChangeCallFunc = null;
        this.itemEventCallFunc = null;
        this.rapidItemData = null;
    }

    /**
     * @override
     * item被移除时播放的动画效果
     * @returns {Promise<any>}
     */
    removeAnimation(): Promise<any> {
        return new Promise(resolve => {
            this.layerArray.forEach(element => {
                element.active = false;
            });
            resolve();
        })
    }

    /**
     * @override
     * item被添加时播放的动画效果
     * @returns {Promise<any>}
     */
    addAnimation(): Promise<any> {
        return new Promise(resolve => {
            resolve();
        })
    }

    /**
     * @override
     * 当有item被添加删除是，当前item播放的动画效果
     * @returns {Promise<any>}
     */
    changeIndexAnimation(): Promise<any> {
        return new Promise(resolve => {
            this.updatePosition();
            resolve();
        })
    }

    // 更新每一层的坐标
    updatePosition() {
        for (let i = 0; i < this.layerArray.length; i++) {
            let node = i === 0 ? this.node : this.layerArray[i];
            node.setPosition(this.rapidItemData.position);
        }
    }

    // 获取item分层的层数
    getLayerCount(): number {
        return this.node.childrenCount;
    }

    getPostion() {
        this.node.getPosition();
    }

    // 获取当前item数组下标index
    getIndex(): number {
        return this.rapidItemData.index;
    }

    //添加item宽高改变的事件监听
    addListenSizeChange(callFunc: Function) {
        this.sizeChangeCallFunc = callFunc;
    }
}

