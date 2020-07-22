import RapidListView from "../../rapidListView/RapidListView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VerticalScroll extends cc.Component {

    @property(RapidListView)
    rapidListView1: RapidListView = null;

    @property(RapidListView)
    rapidListView2: RapidListView = null;

    @property(RapidListView)
    rapidListView3: RapidListView = null;

    onLoad () {
        window.VerticalScroll = this;

        let dataArray1 = [];
        while (dataArray1.length < 50) {
            dataArray1.push({});
        }

        this.rapidListView1.init();

        let dataArray2 = [];
        while (dataArray2.length < 198) {
            dataArray2.push({});
        }

        this.rapidListView2.init();

        let dataArray3 = [];
        while (dataArray3.length < 50) {
            dataArray3.push({});
        }

        this.rapidListView3.init();
    }

    onEnable() {
        this.rapidListView1.updateView(50, 0);
        this.rapidListView2.updateView(198, 0);
        this.rapidListView3.updateView(50, 0);
    }

    // update (dt) {}
}
