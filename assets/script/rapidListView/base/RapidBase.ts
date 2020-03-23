import RapidListView from "../RapidListView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidBase extends cc.Component {

    protected rapidListView: RapidListView;

    init(rapidListView: RapidListView) {
        this.rapidListView = rapidListView;
        this.onInit();
        RapidListView
    }

    protected onInit() {

    }
}
