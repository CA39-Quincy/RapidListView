import RapidBase from "../base/RapidBase";
import {RapidRollDirection} from "../enum/RapidEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidData extends RapidBase {

    public layoutData: RapidLayoutData;

    private content: cc.Node = null;
    private layout: cc.Layout = null;

    private itemDataArray: RapidItemData[] = [];

    private itemCount: number = 0;

    protected onInit() {
        this.content = this.node.getComponent(cc.ScrollView).content;
        this.layout = this.content.getComponent(cc.Layout);
    }

    updateDataArray(itemCount: number) {
        this.itemCount = itemCount;
        this.layoutData = {} as RapidLayoutData;

        let itemNode = this.rapidListView.getItemTemplateNode();
        let isVertical = this.rapidListView.getIsVerticalRoll();
        let itemWidth = isVertical ? itemNode.width : itemNode.height;
        let itemHeight = isVertical ? itemNode.height : itemNode.width;
        let spacingX = isVertical ? this.layout.spacingX : this.layout.spacingY;
        let spacingY = isVertical ? this.layout.spacingY : this.layout.spacingX;
        let paddingHorizontal = isVertical ? this.layout.paddingLeft + this.layout.paddingRight : this.layout.paddingTop + this.layout.paddingBottom;
        let paddingVertical = isVertical ? this.layout.paddingTop + this.layout.paddingBottom : this.layout.paddingLeft + this.layout.paddingRight;

        this.layoutData.contentWidth = isVertical ? this.content.width : this.content.height;
        this.layoutData.rowItemNum = this.layout.type === cc.Layout.Type.GRID ?
            Math.floor((this.layoutData.contentWidth + spacingX - paddingHorizontal) / (itemWidth + spacingX)) : 1;

        this.layoutData.contentHeight = Math.ceil(itemCount / this.layoutData.rowItemNum) * (itemHeight + spacingY) + paddingVertical - spacingY;
        this.layoutData.viewHeight = isVertical ? this.node.height : this.node.width;
        let viewHeightNum = Math.ceil((this.layoutData.viewHeight + spacingY - (isVertical ? this.layout.paddingTop : this.layout.paddingLeft)) / (itemHeight + spacingY)) + 1;
        this.layoutData.showItemNum = Math.min(this.layoutData.rowItemNum * viewHeightNum, itemCount);

        this.layoutData.isPositiveDirection = (isVertical && this.layout.verticalDirection === cc.Layout.VerticalDirection.TOP_TO_BOTTOM) ||
            (!isVertical && this.layout.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT);

        for (let i = 0; i < itemCount; i++) {
            this.getItemData(i);
        }
    }

    getItemCount(): number {
        return this.itemCount;
    }

    updateItemSize(index: number, size: cc.Size) {
        let nowSize = this.itemDataArray[index].size;
        let isVertical = this.rapidListView.getIsVerticalRoll();
        let sizeDiffer = isVertical ? size.height - nowSize.height : size.width - nowSize.width;

        this.itemDataArray[index].size = size;
        this.layoutData.contentHeight += sizeDiffer;

        for (let i = index, iLength = this.itemDataArray.length; i < iLength; i++) {
            let itemData = this.itemDataArray[i];
            if (itemData) {
                if (i === index) {
                    let tempItem = this.rapidListView.getItemTemplateNode();
                    if (isVertical)
                        this.rapidListView.getIsPositiveSort() ? itemData.position.y -= sizeDiffer * (1 - tempItem.anchorY) : itemData.position.y += sizeDiffer * tempItem.anchorY;
                    else
                        this.rapidListView.getIsPositiveSort() ? itemData.position.x += sizeDiffer * tempItem.anchorX : itemData.position.x -= sizeDiffer * tempItem.anchorX;
                }
                else {
                    if (isVertical)
                        this.rapidListView.getIsPositiveSort() ? itemData.position.y -= sizeDiffer : itemData.position.y += sizeDiffer;
                    else
                        this.rapidListView.getIsPositiveSort() ? itemData.position.x += sizeDiffer : itemData.position.x -= sizeDiffer;
                }
            }
        }
    }

    getItemData(index: number): RapidItemData {
        if (this.itemDataArray[index]) {
            return this.itemDataArray[index];
        }

        let itemNode = this.rapidListView.getItemTemplateNode();

        this.itemDataArray[index] = {
            index: index,
            position: this.getItemPosition(index),
            size: itemNode.getContentSize(),
        } as RapidItemData;

        return this.itemDataArray[index];
    }

    removeItemData(index: number) {
        // 删除item后，是否自适应宽高的坐标补位算法不一样
        if(this.rapidListView.getIsAdaptionSize()) {
            this.updateItemSize(index, cc.size(-this.layout.spacingX, -this.layout.spacingY));
        }
        else {
            for(let i = this.itemDataArray.length - 1, iLength = index; i > iLength; i--) {
                let lastPosition = this.itemDataArray[i - 1].position;
                this.itemDataArray[i].position = cc.v2(lastPosition.x, lastPosition.y);
            }
        }

        this.itemDataArray.splice(index, 1);
    }

    private getItemPosition(index: number): cc.Vec2 {
        let isRollVertical = this.rapidListView.getIsVerticalRoll();
        // 从上到下排序
        let isTopToBottom = this.layout.verticalDirection === cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
        // 从左到右
        let isLeftToRight = this.layout.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
        let isGrid = this.layout.type === cc.Layout.Type.GRID;
        let itemNode = this.rapidListView.getItemTemplateNode();
        let size: cc.Size = this.itemDataArray[index] ? this.itemDataArray[index].size : itemNode.getContentSize();
        let pox: number, poy: number;

        /*
            布局限制条件：
                1、所有item锚点必须统一
                2、cc.Layout.Type.GRID网格布局模式下所有item宽高必须统一
         */

        // 垂直滚动
        if (isRollVertical) {
            let rowItemNum: number;

            if (isGrid)
                rowItemNum = Math.floor((this.content.width + this.layout.spacingX - (this.layout.paddingLeft + this.layout.paddingRight)) / (size.width + this.layout.spacingX));
            else
                rowItemNum = 1;

            if (isTopToBottom)
                poy = 0 - this.layout.paddingTop - itemNode.height * (1 - itemNode.anchorY) - Math.floor(index / rowItemNum) * (itemNode.height + this.layout.spacingY);
            else
                poy = this.layout.paddingBottom + itemNode.height * itemNode.anchorY + Math.floor(index / rowItemNum) * (itemNode.height + this.layout.spacingY);

            if (isGrid) {
                if (isLeftToRight)
                    pox = this.content.width * (0 - this.content.anchorX) + this.layout.paddingLeft + itemNode.width * itemNode.anchorX + index % rowItemNum * (itemNode.width + this.layout.spacingX);
                else
                    pox = this.content.width * this.content.anchorX - this.layout.paddingRight - itemNode.width * (1 - itemNode.anchorX) - index % rowItemNum * (itemNode.width + this.layout.spacingX);
            }
            else {
                pox = 0
            }
        }
        // 水平滚动
        else {
            let lineItemNum: number;

            if (isGrid) {
                lineItemNum = Math.floor((this.content.height + this.layout.spacingY - (this.layout.paddingTop + this.layout.paddingBottom)) / (size.height + this.layout.spacingY));
            }
            else {
                lineItemNum = 1;
            }

            if (isLeftToRight)
                pox = this.layout.paddingLeft + itemNode.width * itemNode.anchorX + Math.floor(index / lineItemNum) * (itemNode.width + this.layout.spacingX);
            else
                pox = 0 - this.layout.paddingRight - itemNode.width * (1 - itemNode.anchorX) - Math.floor(index / lineItemNum) * (itemNode.width + this.layout.spacingX);

            if (isGrid) {
                if (isTopToBottom)
                    poy = this.content.height * this.content.anchorY - this.layout.paddingTop - itemNode.height * (1 - itemNode.anchorY) - index % lineItemNum * (itemNode.height + this.layout.spacingY);
                else
                    poy = this.content.height * (0 - this.content.anchorY) + this.layout.paddingBottom + itemNode.height * itemNode.anchorY + index % lineItemNum * (itemNode.height + this.layout.spacingY);
            }
            else {
                poy = 0
            }
        }

        return cc.v2(pox, poy);
    }
}
