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
        // this.showItemMap[index].updatePosition(this.rapidListView.rapidData.getItemData(index));
        this.content.height = this.rapidListView.rapidData.layoutData.contentHeight;
    }

    private itemShow(index: number) {
        let itemNode = this.rapidListView.rapidNodePool.get();
        let itemScript = itemNode.getComponent(RapidItemBase);

        this.showItemMap[index] = itemScript;
        this.rapidListView.getIsAdaptionSize() && itemScript.addListenSizeChange(this.onItemSizeChange.bind(this));
        itemScript.show(this.rapidListView.rapidData.getItemData(index), this.layerArray, this.rapidListView.getItemEvent());
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

            while (showIndex >= 0 && showIndex < this.rapidListView.rapidData.getDataLength()) {
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
        // cc.log("itemIndex", itemIndex, isPositive ? "++" : "--");
    }

    private onRollEvent() {
        let differPosition = this.content.position.sub(this.contentPastPos);
        let isVertical = this.rapidListView.getRollDirectionType() === RapidRollDirection.VERTICAL;

        let a = this.scrollView.getMaxScrollOffset();
        let b = this.scrollView.getScrollOffset();
        let c = isVertical ? b.y / a.y : -(b.x / a.x);

        // cc.log(a, b, c);
        // cc.log("rrrrrrr", this.content.position, this.content.height, differPosition.mag());

        if (differPosition.mag() > 10 && c >= 0 && c <= 1) {
            this.contentPastPos = this.content.position;

            let isPositive = differPosition.x < 0 || differPosition.y > 0;
            this.checkItemPosition(isPositive);
        }
    }

    updateLayout(toPositionType: RapidToPositionType) {
        // this.scrollView.scrollToOffset(cc.v2(0, 0), 0.1);
        let isVertical = this.rapidListView.getRollDirectionType() === RapidRollDirection.VERTICAL;
        let layoutData: RapidLayoutData = this.rapidListView.rapidData.layoutData;
        isVertical ? (this.content.height = layoutData.contentHeight) : (this.content.width = layoutData.contentHeight);

        let showIndex = layoutData.isPositiveDirection ? 0 : this.rapidListView.rapidData.getDataLength() - 1;

        showIndex = 0;

        for (let i = 0; i < layoutData.showItemNum; i++) {
            this.itemShow(showIndex);

            // layoutData.isPositiveDirection ? showIndex++ : showIndex--;
            showIndex++
        }
        // !layoutData.isPositiveDirection && this.scrollToBottom(0.1);
    }




    scrollToBottom(time: number) {
        this.scrollView.scrollToBottom(time);

        this.scheduleOnce(() => {
            if (this.content.y + this.node.height < this.content.height) {
                this.scrollToBottom(time);
            }
        })
    }
}
