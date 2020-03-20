import RapidBase from "../base/RapidBase";
import RapidItemBase from "../base/RapidItemBase";
import {RapidRollDirection, RapidToPositionType} from "../enum/RapidEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidLayout extends RapidBase {

    private scrollView: cc.ScrollView = null;
    private content: cc.Node = null;
    private layout: cc.Layout = null;

    private layerArray: cc.Node[] = [];
    private showItemMap: {[key: string]: RapidItemBase} = Object.create(null);

    private viewWorldPos: cc.Vec2 = cc.v2(0, 0);
    private contentPastPos: cc.Vec2 = cc.v2(0, 0);

    protected onInit() {
        this.scrollView = this.node.getComponent(cc.ScrollView);
        this.viewWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        this.content = this.scrollView.content;
        this.contentPastPos = this.content.getPosition();

        this.scrollView.node.on("scrolling", this.onRollEvent, this);

        this.initLayout();
        this.createLayer();
    }

    private initLayout() {
        this.layout = this.content.getComponent(cc.Layout);
        this.layout.enabled = false;
    }

    private createLayer() {
        let rapidItem: RapidItemBase = this.rapidScrollView.getItemTemplateScript();
        let itemLayers: cc.Node[] = rapidItem.getLayerArray();

        for (let i = 0, len = itemLayers.length; i < len; i++) {
            let layerNode = new cc.Node("Layer" + i);
            this.content.addChild(layerNode);
            layerNode.setPosition(0, 0);

            this.layerArray.push(layerNode);
        }
    }

    private itemShow(index: number) {
        // cc.log("item show", index);
        let itemNode = this.rapidScrollView.rapidNodePool.get();
        let itemScript = itemNode.getComponent(RapidItemBase);

        itemScript.show(this.rapidScrollView.rapidData.getItemData(index), this.layerArray);
        this.showItemMap[index] = itemScript;
    }

    private itemHide(index: number) {
        let item: RapidItemBase = this.showItemMap[index];
        item.hide();

        this.rapidScrollView.rapidNodePool.put(item.node);
        delete this.showItemMap[index];
    }

    /**
     *
     * @param {boolean} isPositive 是否为正方向滚动
     */
    private checkItemPosition(isPositive: boolean) {
        let itemKeyArray = Object.keys(this.showItemMap);
        let layoutData: RapidLayoutData = this.rapidScrollView.rapidData.layoutData;

        isPositive = (isPositive && layoutData.isPositiveDirection) || (!isPositive && !layoutData.isPositiveDirection);
        let itemIndex = Number(itemKeyArray[isPositive ? 0 : itemKeyArray.length - 1]);

        // * 2 多加一行屏幕外预加载
        let showRange = (this.node.height + layoutData.itemHeight * 2 + layoutData.spacingY) / 2;

        // 检测是否在屏幕内
        let checkIsInViewFunc = (node: cc.Node): boolean => {
            let itemWorldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
            let differPos = itemWorldPos.sub(this.viewWorldPos);
            let differ = Math.floor(Math.abs(this.rapidScrollView.getRollDirectionType() === RapidRollDirection.VERTICAL ? differPos.y : differPos.x));
            // cc.log(node.getComponent(RapidItemBase).getIndex(), itemWorldPos, differPos, differ, showRange);

            return differ <= showRange;
        };

        let checkShowItemFunc = (index: number) => {
            let showIndex = index + (isPositive ? 1 : -1);

            while (showIndex >= 0 && showIndex < this.rapidScrollView.rapidData.getDataLength()) {
                if(!this.showItemMap[showIndex]){
                    this.itemShow(showIndex);

                    if(!checkIsInViewFunc(this.showItemMap[showIndex].node)){

                        // cc.log("不在显示范围内", showIndex);
                        break;
                    }
                }

                isPositive ? showIndex++ : showIndex--;
            }

            // cc.log("show index", showIndex);
        };

        while (this.showItemMap[itemIndex] && !checkIsInViewFunc(this.showItemMap[itemIndex].node)) {
            itemKeyArray.length > 1 && this.itemHide(itemIndex);
            checkShowItemFunc(itemIndex);

            isPositive ? itemIndex++ : itemIndex--;
        }

        Object.keys(this.showItemMap).length < layoutData.showItemNum && checkShowItemFunc(itemIndex);
        // cc.log("itemIndex", itemIndex, isPositive ? "++" : "--");
    }

    private onRollEvent() {
        let differPosition = this.content.position.sub(this.contentPastPos);

        if (differPosition.mag() > 10) {
            this.contentPastPos = this.content.position;

            let isPositive = differPosition.x > 0 || differPosition.y > 0;
            this.checkItemPosition(isPositive);
        }
    }

    updateLayout(toPosition: RapidToPositionType) {
        let isVertical = this.rapidScrollView.getRollDirectionType() === RapidRollDirection.VERTICAL;
        let layoutData: RapidLayoutData = this.rapidScrollView.rapidData.layoutData;
        isVertical ? (this.content.height = layoutData.contentHeight) : (this.content.width = layoutData.contentHeight);

        let showIndex = layoutData.isPositiveDirection ? 0 : this.rapidScrollView.rapidData.getDataLength() - 1;

        for (let i = 0; i < layoutData.showItemNum; i++) {
            this.itemShow(showIndex);

            layoutData.isPositiveDirection ? showIndex++ : showIndex--;
        }
    }
}
