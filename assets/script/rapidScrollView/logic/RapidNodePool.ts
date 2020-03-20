import RapidBase from "../base/RapidBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidNodePool extends RapidBase {

    private itemNodePool: cc.NodePool = null;

    onInit() {
        this.itemNodePool = new cc.NodePool();
    }

    onDestroy() {
        this.itemNodePool.clear();
    }

    get() {
        return this.itemNodePool.size() > 0 ? this.itemNodePool.get() : cc.instantiate(this.rapidScrollView.getItemTemplate());
    }

    put(node: cc.Node) {
        this.itemNodePool.put(node);
    }
}
