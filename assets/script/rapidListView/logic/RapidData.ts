import RapidBase from "../base/RapidBase";
import {RapidRollDirection} from "../enum/RapidEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidData extends RapidBase {

    // private _rowItemNum: number = 1;
    // public set rowItemNum(val: number) {
    //     this._rowItemNum = val;
    // }
    // public get rowItemNum() {
    //     return this._rowItemNum;
    // }

    public layoutData: RapidLayoutData;

    private content: cc.Node = null;
    private layout: cc.Layout = null;

    private itemDataArray: RapidItemData[] = [];
    private dataArray: any[] = [];

    private updateItemIndex: number = 0;

    protected onInit() {
        this.content = this.node.getComponent(cc.ScrollView).content;
        this.layout = this.content.getComponent(cc.Layout);
    }

    updateDataArray(dataArray: any[]) {
        this.dataArray = dataArray;


        let itemNode = this.rapidListView.getItemTemplateNode();
        let dataLength = this.dataArray.length;
        let isVertical = this.rapidListView.getRollDirectionType() === RapidRollDirection.VERTICAL;

        this.layoutData = {} as RapidLayoutData;

        this.layoutData.itemWidth = isVertical ? itemNode.width : itemNode.height;
        this.layoutData.itemHeight = isVertical ? itemNode.height : itemNode.width;

        this.layoutData.itemAnchorX = isVertical ? itemNode.anchorX : itemNode.anchorY;
        this.layoutData.itemAnchorY = isVertical ? itemNode.anchorY : itemNode.anchorX;

        this.layoutData.spacingX = isVertical ? this.layout.spacingX : this.layout.spacingY;
        this.layoutData.spacingY = isVertical ? this.layout.spacingY : this.layout.spacingX;

        this.layoutData.paddingHorizontal = isVertical ? this.layout.paddingLeft + this.layout.paddingRight : this.layout.paddingTop + this.layout.paddingBottom;
        this.layoutData.paddingVertical = isVertical ? this.layout.paddingTop + this.layout.paddingBottom : this.layout.paddingLeft + this.layout.paddingRight;

        this.layoutData.paddingHorizontalStart = this.layout.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT ? this.layout.paddingLeft : this.layout.paddingRight;
        this.layoutData.paddingVerticalStart = this.layout.verticalDirection === cc.Layout.VerticalDirection.TOP_TO_BOTTOM ? this.layout.paddingTop : this.layout.paddingBottom;

        this.layoutData.contentWidth = isVertical ? this.content.width : this.content.height;
        this.layoutData.rowItemNum = this.layout.type === cc.Layout.Type.GRID ?
            Math.floor((this.layoutData.contentWidth + this.layoutData.spacingX - this.layoutData.paddingHorizontal) /
                (this.layoutData.itemWidth + this.layoutData.spacingX)) : 1;

        this.layoutData.contentHeight = Math.ceil(dataLength / this.layoutData.rowItemNum) * (this.layoutData.itemHeight + this.layoutData.spacingY) + this.layoutData.paddingVertical - this.layoutData.spacingY;

        this.layoutData.viewHeight = isVertical ? this.node.height : this.node.width;
        this.layoutData.viewHeightNum = Math.ceil((this.layoutData.viewHeight + this.layoutData.spacingY - (isVertical ? this.layout.paddingTop : this.layout.paddingLeft)) / (this.layoutData.itemHeight + this.layoutData.spacingY)) + 1;
        this.layoutData.showItemNum = Math.min(this.layoutData.rowItemNum * this.layoutData.viewHeightNum, dataLength);

        this.layoutData.isPositiveDirection = (isVertical && this.layout.verticalDirection === cc.Layout.VerticalDirection.TOP_TO_BOTTOM) ||
            (!isVertical && this.layout.horizontalDirection === cc.Layout.HorizontalDirection.LEFT_TO_RIGHT);
    }

    getDataArray(): any[] {
        return this.dataArray
    }

    getDataLength(): number {
        return this.dataArray.length;
    }

    getData(index: number): any {
        return this.dataArray[index]
    }

    updateData(index: number, data: any) {
        if (this.dataArray[index] === undefined) {
            cc.error(`更新的数据下标溢出！最大下标${this.dataArray.length - 1};传入参数${index}!`);

            return;
        }

        this.dataArray[index] = data;
    }

    updateItemSize(index: number, size: cc.Size) {
        if (index !== this.updateItemIndex) {
            return
        }
        this.updateItemIndex = index;

        if (index === this.itemDataArray.length - 1) {
            this.updateItemIndex = this.itemDataArray.length;
        }

        let itemData: RapidItemData = this.itemDataArray[index];
        let sizeDiffer = itemData.size.height - this.layoutData.itemHeight;
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
            itemData: this.dataArray[index]
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

            if (isGrid) {
                rowItemNum = Math.floor((this.content.width + this.layout.spacingX - (this.layout.paddingLeft + this.layout.paddingRight)) / (size.width + this.layout.spacingX));
            }
            else {
                rowItemNum = 1;
            }

            if (index === 0) {
                if (isTopToBottom)
                    poy = -this.layout.paddingTop - size.height * (1 - itemNode.anchorY);
                else
                    poy = this.layout.paddingBottom + size.height * itemNode.anchorY;
            }
            else {
                let lastData = this.itemDataArray[isGrid ? Math.max(index - rowItemNum, 0) : index - 1];

                if(index < rowItemNum) {
                    poy = lastData.position.y;
                }
                else {
                    let distance: number;
                    if(isTopToBottom)
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
                    pox = this.layoutData.paddingHorizontalStart + size.width * itemNode.anchorX;
                else
                    pox = -this.layoutData.paddingHorizontalStart - size.width * (1 - itemNode.anchorX);
            }
            else {
                let lastData = this.itemDataArray[isGrid ? Math.max(index - lineItemNum, 0) : index - 1];

                if(index < lineItemNum) {
                    pox = lastData.position.x;
                }
                else {
                    let distance: number;
                    if(isLeftToRight)
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
