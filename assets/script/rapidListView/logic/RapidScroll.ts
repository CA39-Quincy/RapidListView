import RapidBase from "../base/RapidBase";
import RapidItemBase from "../base/RapidItemBase";
import {RapidRollDirection, RapidToPositionType} from "../enum/RapidEnum";

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
        let itemLayers: cc.Node[] = rapidItem.getLayerArray();

        for (let i = 0, len = itemLayers.length; i < len; i++) {
            let layerNode = new cc.Node("Layer" + i);
            this.content.addChild(layerNode);
            layerNode.setPosition(0, 0);

            this.layerArray.push(layerNode);
        }
    }

    private onItemSizeChange(index: number, itemSize: cc.Size) {
        this.rapidListView.rapidData.updateItemSize(index, itemSize);
        this.showItemMap[index].updatePosition(this.rapidListView.rapidData.updatePosition(index));
        this.content.height = this.rapidListView.rapidData.layoutData.contentHeight;
    }

    private itemShow(index: number) {
        let itemNode = this.rapidListView.rapidNodePool.get();
        let itemScript = itemNode.getComponent(RapidItemBase);

        this.showItemMap[index] = itemScript;
        this.rapidListView.getIsAdaptionSize() && itemScript.addListenSizeChange(this.onItemSizeChange.bind(this));
        itemScript.show(this.rapidListView.rapidData.getItemData(index), this.rapidListView.getItemData(index), this.layerArray, this.rapidListView.getItemEvent());
    }

    private itemHide(index: number) {
        let item: RapidItemBase = this.showItemMap[index];
        item.hide();

        this.rapidListView.rapidNodePool.put(item.node);
        delete this.showItemMap[index];
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

        // 检测是否在屏幕内
        let checkIsInViewFunc = (node: cc.Node, index): boolean => {

            let worldPosition = node.convertToWorldSpaceAR(cc.v2(-(node.width * node.anchorX), -(node.height * node.anchorY)));
            let b = new cc.Rect(worldPosition.x, worldPosition.y, node.width, node.height);
            let c = this.viewRect.intersects(b);

            // cc.log("相交判断", index, c, this.viewRect, b, node.getPosition());

            return c;
        };

        let checkShowItemFunc = (index: number) => {
            let showIndex = index + (isPositive ? 1 : -1);

            while (showIndex >= 0 && showIndex < this.rapidListView.rapidData.getItemCount()) {
                // 预先在屏幕外充填一个
                !this.showItemMap[showIndex] && this.itemShow(showIndex);
                let isInView = checkIsInViewFunc(this.showItemMap[showIndex].node, showIndex);

                if (!isInView) {

                    break;
                }

                isPositive ? showIndex++ : showIndex--;
            }
        };

        while (this.showItemMap[itemIndex] && !checkIsInViewFunc(this.showItemMap[itemIndex].node, itemIndex)) {
            itemKeyArray.length > 1 && this.itemHide(itemIndex);
            checkShowItemFunc(itemIndex);

            isPositive ? itemIndex++ : itemIndex--;
        }

        Object.keys(this.showItemMap).length < layoutData.showItemNum && checkShowItemFunc(itemIndex);
    }

    private onRollEvent() {
        let differPosition = this.content.position.sub(this.contentPastPos);
        let scrollOffset = this.getScrollOffsetRate();
        // cc.log("rrrrrrr", this.content.position, this.content.height, differPosition.mag());

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

        return c;
    }

    updateLayout(toOffset?: number) {
        let layoutData: RapidLayoutData = this.rapidListView.rapidData.layoutData;
        this.rapidListView.getIsVerticalRoll() ? (this.content.height = layoutData.contentHeight) : (this.content.width = layoutData.contentHeight);

        for (let i = 0; i < layoutData.showItemNum; i++) {
            this.itemShow(i);
        }

        this.scrollToOffset(toOffset || 0, 0.03);
    }

    scrollToOffset(offset: number, time: number) {
        let maxOffset = this.scrollView.getMaxScrollOffset();
        // 以创建的起始位置作为0
        !this.rapidListView.getIsPositiveSort() && (offset = 1 - offset);
        let v2 = this.rapidListView.getIsVerticalRoll() ? cc.v2(0, offset * maxOffset.y) : cc.v2(offset * maxOffset.x, 0);

        this.scrollView.scrollToOffset(v2, time);
    }

    scrollToBottom(time: number) {
        this.scrollView.scrollToBottom(time);

        this.scheduleOnce(() => {
            let scrollOffset = this.getScrollOffsetRate();
            if (scrollOffset > 0 && scrollOffset < 1) {
                this.scrollToBottom(time);
            }
        }, time)
    }
}
