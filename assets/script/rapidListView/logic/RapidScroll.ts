import RapidBase from "../base/RapidBase";
import RapidItemBase from "../base/RapidItemBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidScroll extends RapidBase {

    private scrollView: cc.ScrollView = null;
    private content: cc.Node = null;
    private layout: cc.Layout = null;

    private layerArray: cc.Node[] = [];
    private showItemMap: { [key: string]: RapidItemBase } = Object.create(null);

    private viewWorldPos: cc.Vec2 = cc.v2(0, 0);
    private contentPastPos: cc.Vec2 = cc.v2(0, 0);
    private viewRect: cc.Rect;

    protected onInit() {

        this.scrollView = this.node.getComponent(cc.ScrollView);
        this.viewWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        this.content = this.scrollView.content;
        this.contentPastPos = this.content.getPosition();

        this.initLayout();
        this.createLayer();

        let worldPosition = this.node.convertToWorldSpaceAR(cc.v2(-(this.node.width * this.node.anchorX), -(this.node.height * this.node.anchorY)));
        this.viewRect = new cc.Rect(worldPosition.x, worldPosition.y, this.node.width, this.node.height);

        cc.log("view init", this.node.name, this.viewRect, this.node);
    }

    onEnable() {
        this.node.on("scrolling", this.onRollEvent, this);
    }

    onDisable() {
        this.node.off("scrolling", this.onRollEvent, this);
    }

    private initLayout() {
        this.layout = this.content.getComponent(cc.Layout);
        this.layout.enabled = false;
    }

    private createLayer() {
        let rapidItem: RapidItemBase = this.rapidListView.getItemTemplateScript();

        for (let i = 0, len = rapidItem.getLayerCount(); i < len; i++) {
            let layerNode = new cc.Node("Layer" + i);
            this.content.addChild(layerNode);
            layerNode.setPosition(0, 0);

            this.layerArray.push(layerNode);
        }
    }

    private onItemSizeChange(index: number, itemSize: cc.Size) {
        this.rapidListView.rapidData.updateItemSize(index, itemSize);
        this.setContentSize();

        while (this.showItemMap[index]) {
            this.showItemMap[index].updatePosition();
            index++;
        }
    }

    private itemShow(index: number) {
        let itemNode = this.rapidListView.rapidNodePool.get();
        let itemScript = itemNode.getComponent(RapidItemBase);

        this.showItemMap[index] = itemScript;
        this.rapidListView.getIsAdaptionSize() && itemScript.addListenSizeChange(this.onItemSizeChange.bind(this));
        itemScript.show(this.rapidListView.rapidData.getItemData(index), this.rapidListView.getItemData(index), this.layerArray, this.rapidListView.getItemEvent());
    }

    private itemHide(index: number | string) {
        let item: RapidItemBase = this.showItemMap[index];
        item.hide();

        this.rapidListView.rapidNodePool.put(item.node);
        delete this.showItemMap[index];
    }

    // 检测是否在屏幕内
    checkIsInView(node: cc.Node): boolean {
        let worldPosition = node.convertToWorldSpaceAR(cc.v2(-(node.width * node.anchorX), -(node.height * node.anchorY)));
        let rect = new cc.Rect(worldPosition.x, worldPosition.y, node.width, node.height);
        let intersects = this.viewRect.intersects(rect);

        return intersects
    }

    /**
     *
     * @param {boolean} isPositive 是否为正方向滚动
     */
    private checkItemPosition(isPositive: boolean) {

        let itemKeyArray = Object.keys(this.showItemMap);
        let layoutData: RapidLayoutData = this.rapidListView.rapidData.layoutData;

        isPositive = (isPositive && layoutData.isPositiveDirection) || (!isPositive && !layoutData.isPositiveDirection);
        let itemIndex = Number(itemKeyArray[isPositive ? 0 : itemKeyArray.length - 1]);

        let checkShowItemFunc = (index: number) => {
            let showIndex = index + (isPositive ? 1 : -1);

            while (showIndex >= 0 && showIndex < this.rapidListView.rapidData.getItemCount()) {
                // 预先在屏幕外充填一个
                !this.showItemMap[showIndex] && this.itemShow(showIndex);
                let isInView = this.checkIsInView(this.showItemMap[showIndex].node);

                if (!isInView) {

                    break;
                }

                isPositive ? showIndex++ : showIndex--;
            }
        };

        while (this.showItemMap[itemIndex] && !this.checkIsInView(this.showItemMap[itemIndex].node)) {
            itemKeyArray.length > 1 && this.itemHide(itemIndex);
            checkShowItemFunc(itemIndex);

            isPositive ? itemIndex++ : itemIndex--;
        }

        Object.keys(this.showItemMap).length < layoutData.showItemNum && checkShowItemFunc(itemIndex);
    }

    private onRollEvent() {
        let differPosition = this.content.position.sub(this.contentPastPos);
        let scrollOffset = this.getScrollOffsetRate();
        // cc.log("onRollEvent", this.content.position, this.content.height, differPosition.mag());

        if (differPosition.mag() > 10 && scrollOffset >= 0 && scrollOffset <= 1) {
            this.contentPastPos = this.content.position;

            let isPositive = differPosition.x < 0 || differPosition.y > 0;
            this.checkItemPosition(isPositive);
        }
    }

    private getScrollOffsetRate(): number {

        let a = this.scrollView.getMaxScrollOffset();
        let b = this.scrollView.getScrollOffset();
        let c = this.rapidListView.getIsVerticalRoll() ? parseInt(b.y.toFixed()) / parseInt(a.y.toFixed()) : -(parseInt(b.x.toFixed()) / parseInt(a.x.toFixed()));

        return isNaN(c) ? 0 : c;
    }


    private setContentSize() {
        let layoutData: RapidLayoutData = this.rapidListView.rapidData.layoutData;
        this.rapidListView.getIsVerticalRoll() ? (this.content.height = layoutData.contentHeight) : (this.content.width = layoutData.contentHeight);
    }

    updateLayout(toOffset?: number) {
        this.setContentSize();
        let layoutData: RapidLayoutData = this.rapidListView.rapidData.layoutData;

        for (let i = 0; i < layoutData.showItemNum; i++) {
            this.itemShow(i);
        }

        this.scrollToOffset(toOffset || 0, 0.03);
    }

    scrollToOffset(offset: number, time: number) {
        let maxOffset = this.scrollView.getMaxScrollOffset();
        let offset2 = this.rapidListView.getIsPositiveSort() ? offset : 1 - offset;
        // 以创建的起始位置作为0
        let v2 = this.rapidListView.getIsVerticalRoll() ? cc.v2(0, offset2 * maxOffset.y) : cc.v2(offset2 * maxOffset.x, 0);
        this.scrollView.scrollToOffset(v2, time);

        if (offset2 === 0 || offset2 === 1) {
            this.scheduleOnce(() => {
                let scrollOffset = this.getScrollOffsetRate();
                scrollOffset > 0 && scrollOffset < 1 && this.scrollToOffset(offset, 0.05);
            }, time)
        }
    }

    scrollToIndex(index: number, time: number) {
        let maxOffset = this.scrollView.getMaxScrollOffset();
        let itemData: RapidItemData = this.rapidListView.rapidData.getItemData(index);
        let targetPos = cc.v2(itemData.position.x, itemData.position.y);
        let offset: number;

        if (this.rapidListView.getIsVerticalRoll()) {
            targetPos.y = Math.abs(targetPos.y) - this.node.height / 2;
            offset = targetPos.y / maxOffset.y;
        }
        else {
            targetPos.x = Math.abs(targetPos.x) - this.node.width / 2;
            offset = targetPos.x / maxOffset.x;
        }

        this.scrollToOffset(offset, time);
    }

    addItem(index: number) {
        this.rapidListView.rapidData.addItemData(index);
        let keyArray = Object.keys(this.showItemMap);
        let key, changeIndex = 0, changeCount = 0;

        let changeEnd = () => {
            // 多余的一个item回池
            if (index < this.rapidListView.rapidData.getItemCount() - 1) {
                let redundantIndex = Number(keyArray[keyArray.length - 1]) + 1;
                !this.checkIsInView(this.showItemMap[redundantIndex].node) && this.itemHide(redundantIndex);
            }

            // key > index ? this.itemShow(key) : this.itemShow(index);
            if (key > index) {
                this.itemShow(key)
            }
            else {
                this.itemShow(index);
                this.showItemMap[index].addAnimation().then(() => {
                })
            }

            this.setContentSize();
        };

        for (let i = keyArray.length - 1; i >= 0; i--) {
            key = Number(keyArray[i]);

            if(i === keyArray.length - 1 && key < index) {
                changeEnd();

                break;
            }

            if (key >= index) {
                changeCount++;
                this.showItemMap[key + 1] = this.showItemMap[key];
                this.showItemMap[key + 1].changeIndexAnimation().then(() => ++changeIndex === changeCount && changeEnd());
            }
        }
    }

    removeItem(index: number) {
        this.rapidListView.rapidData.removeItemData(index);

        // 如果移除的item在视图内
        if (this.showItemMap[index]) {
            this.showItemMap[index].removeAnimation().then(() => {
                this.itemHide(index);

                while (true) {
                    if (!this.showItemMap[index + 1]) {
                        this.itemShow(index);

                        break;
                    }

                    this.showItemMap[index] = this.showItemMap[index + 1];
                    this.showItemMap[index].changeIndexAnimation();

                    index++;
                }
            })
        }
        else {
            let i;
            for (i in this.showItemMap) {
                i = Number(i);
                this.showItemMap[i - 1] = this.showItemMap[i];
                this.showItemMap[i].changeIndexAnimation();
            }


            if (i < this.rapidListView.rapidData.getItemCount()) {
                this.itemShow(i)
            }
            else {
                let keyArray = Object.keys(this.showItemMap);
                this.itemShow(Number(keyArray[0]) - 1);
            }
        }

        this.setContentSize();
    }
}
