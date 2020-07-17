import RapidListView from "../../rapidListView/RapidListView";
import {RapidToPositionType} from "../../rapidListView/enum/RapidEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HorizontalScroll extends cc.Component {

    @property(RapidListView)
    rapidListView1: RapidListView = null;

    @property(RapidListView)
    rapidListView2: RapidListView = null;

    start() {
        let dataArray1 = [];
        while (dataArray1.length < 50) {
            dataArray1.push({});
        }

        this.rapidListView1.init();
        this.rapidListView1.updateData(dataArray1, RapidToPositionType.TOP);

        let dataArray2 = [];
        while (dataArray2.length < 50) {
            dataArray2.push({});
        }

        this.rapidListView2.init();
        this.rapidListView2.updateData(dataArray2, RapidToPositionType.TOP);
    }
}
