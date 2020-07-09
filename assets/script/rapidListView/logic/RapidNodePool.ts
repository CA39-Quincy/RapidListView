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
        if(this.itemNodePool.size() >0 ) {
            return this.itemNodePool.get();
        }

        let node = cc.instantiate(this.rapidListView.getItemTemplate());
        node.active = true;

        return node;
    }

    put(node: cc.Node) {
        this.itemNodePool.put(node);
    }
}
