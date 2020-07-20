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
    private updateItemIndex: number = 0;

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
    }

    getItemCount(): number {
        return this.itemCount;
    }

    updateItemSize(index: number, size: cc.Size) {
        if (index !== this.updateItemIndex) {
            return
        }
        this.updateItemIndex = index;

        if (index === this.itemDataArray.length - 1) {
            this.updateItemIndex = this.itemDataArray.length;
        }

        let itemNode = this.rapidListView.getItemTemplateNode();
        let isVertical = this.rapidListView.getIsVerticalRoll();

        let sizeDiffer = isVertical ? size.height - itemNode.height : size.width - itemNode.width;

        this.itemDataArray[index].size = size;
        this.layoutData.contentHeight += sizeDiffer;
    }

    updatePosition(index: number) {
        this.itemDataArray[index].position = this.getItemPosition(index);

        return this.itemDataArray[index].position;
    }

    getItemData(index: number): RapidItemData {
        if (index < 0) {
            return null;
        }

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

    private getItemPosition(index: number): cc.Vec2 {
        let isRollVertical = this.rapidListView.getRollDirectionType() === RapidRollDirection.VERTICAL;
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

            if (index === 0) {
                if (isTopToBottom)
                    poy = -this.layout.paddingTop - size.height * (1 - itemNode.anchorY);
                else
                    poy = this.layout.paddingBottom + size.height * itemNode.anchorY;
            }
            else {
                let lastData = this.itemDataArray[isGrid ? Math.max(index - rowItemNum, 0) : index - 1];

                if (index < rowItemNum) {
                    poy = lastData.position.y;
                }
                else {
                    let distance: number;
                    if (isTopToBottom)
                        distance = lastData.size.height * itemNode.anchorY + this.layout.spacingY + size.height * (1 - itemNode.anchorY);
                    else
                        distance = lastData.size.height * (1 - itemNode.anchorY) + this.layout.spacingY + size.height * itemNode.anchorY;

                    poy = lastData.position.y + (isTopToBottom ? -distance : distance);
                }
            }

            if (isGrid) {
                let offset = index % rowItemNum * (size.width + this.layout.spacingX);
                if (isLeftToRight)
                    pox = 0 - this.content.width * this.content.anchorX + this.layout.paddingLeft + size.width * itemNode.anchorX + offset;
                else
                    pox = this.content.width * (1 - this.content.anchorX) - this.layout.paddingRight - size.width * (1 - itemNode.anchorX) - offset;
            }
            else {
                pox = 0;
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

            if (index === 0) {
                if (this.layout.type === cc.Layout.Type.GRID) {

                }
                if (isLeftToRight)
                    pox = this.layout.paddingLeft + size.width * itemNode.anchorX;
                else
                    pox = -this.layout.paddingRight - size.width * (1 - itemNode.anchorX);
            }
            else {
                let lastData = this.itemDataArray[isGrid ? Math.max(index - lineItemNum, 0) : index - 1];

                if (index < lineItemNum) {
                    pox = lastData.position.x;
                }
                else {
                    let distance: number;
                    if (isLeftToRight)
                        distance = lastData.size.width * (1 - itemNode.anchorX) + this.layout.spacingX + size.width * itemNode.anchorX;
                    else
                        distance = lastData.size.width * itemNode.anchorX + this.layout.spacingX + size.width * (1 - itemNode.anchorX);

                    pox = lastData.position.x + (isLeftToRight ? distance : -distance);
                }
            }

            if (isGrid) {
                let offset = index % lineItemNum * (size.height + this.layout.spacingY);
                if (isTopToBottom)
                    poy = this.content.height * this.content.anchorY - this.layout.paddingTop - size.height * itemNode.anchorY - offset;
                else
                    poy = this.content.height * (0 - this.content.anchorY) + this.layout.paddingBottom + size.height * itemNode.anchorY + offset;
            }
            else {
                poy = 0;
            }
        }

        return cc.v2(pox, poy);
    }
}
