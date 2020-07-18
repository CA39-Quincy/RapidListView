import RapidListView from "../../rapidListView/RapidListView";
import {RapidToPositionType} from "../../rapidListView/enum/RapidEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VerticalScroll extends cc.Component {

    @property(RapidListView)
    rapidListView1: RapidListView = null;

    @property(RapidListView)
    rapidListView2: RapidListView = null;

    @property(RapidListView)
    rapidListView3: RapidListView = null;

    start () {
        window.VerticalScroll = this;

        let dataArray1 = [];
        while (dataArray1.length < 50) {
            dataArray1.push({});
        }

        this.rapidListView1.init();
        this.rapidListView1.updateData(dataArray1, RapidToPositionType.TOP);

        let dataArray2 = [];
        while (dataArray2.length < 198) {
            dataArray2.push({});
        }

        this.rapidListView2.init();
        this.rapidListView2.updateData(dataArray2, RapidToPositionType.TOP);

        let dataArray3 = [];
        while (dataArray3.length < 50) {
            dataArray3.push({});
        }

        this.rapidListView3.init();
        this.rapidListView3.updateData(dataArray3, RapidToPositionType.TOP);
    }

    // update (dt) {}
}
