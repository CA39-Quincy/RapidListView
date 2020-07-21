import RapidListView from "../../rapidListView/RapidListView";
import {RapidToPositionType} from "../../rapidListView/enum/RapidEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HorizontalScroll extends cc.Component {

    @property(RapidListView)
    rapidListView1: RapidListView = null;

    @property(RapidListView)
    rapidListView2: RapidListView = null;

    onLoad() {
        window.HorizontalScroll = this;

        let dataArray1 = [];
        while (dataArray1.length < 50) {
            dataArray1.push({});
        }

        this.rapidListView1.init();

        let dataArray2 = [];
        while (dataArray2.length < 200) {
            dataArray2.push({});
        }

        this.rapidListView2.init();
    }

    onEnable() {
        this.rapidListView1.updateView(50, 0);
        this.rapidListView2.updateView(200, 0);

    }
}
