import RapidScrollView from "../logic/RapidScrollView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RapidBase extends cc.Component {

    protected rapidScrollView: RapidScrollView;

    init(rapidScrollView: RapidScrollView) {
        this.rapidScrollView = rapidScrollView;
        this.onInit();
    }

    protected onInit() {

    }
}
