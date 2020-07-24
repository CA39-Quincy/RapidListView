import RapidItemBase from "../../rapidListView/base/RapidItemBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SetItem extends RapidItemBase {

    @property(cc.Label)
    indexLab: cc.Label = null;

    onShow(data) {
        this.indexLab.string = String(data.num);
    }

    removeAnimation() {
        return new Promise(resolve => {
            let actionIndex = 0;
            this.layerArray.forEach(element => {
                element.runAction(cc.sequence(
                    cc.scaleTo(0.2, 0),
                    cc.callFunc(() => {
                        ++actionIndex === this.layerArray.length && resolve();
                    })
                ))
            })
        })
    }

    addAnimation() {
        return new Promise(resolve => {
            let actionIndex = 0;
            this.layerArray.forEach(element => {
                element.scale = 0;
                element.runAction(cc.sequence(
                    cc.scaleTo(0.2, 1),
                    cc.callFunc(() => {
                        ++actionIndex === this.layerArray.length && resolve();
                    })
                ))
            })
        })
    }

    changeIndexAnimation() {
        return new Promise(resolve => {
            this.layerArray.forEach(element => {
                element.runAction(cc.sequence(
                    cc.moveTo(0.2, this.rapidItemData.position),
                    cc.callFunc(() => resolve())
                ));
            });
        })
    }
}
