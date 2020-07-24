import RapidListView from "../../rapidListView/RapidListView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SetItemScroll extends cc.Component {

    @property(RapidListView)
    rapidListView1: RapidListView = null;

    @property(RapidListView)
    rapidListView2: RapidListView = null;

    private dataArray1: any[] = [];

    onLoad () {
        window.SetItemScroll = this;

        while (this.dataArray1.length < 20) {
            this.dataArray1.push({num: this.dataArray1.length});
        }

        this.rapidListView1.init(index => {
            return this.dataArray1[index];
        });

        let dataArray2 = [];
        while (dataArray2.length < 200) {
            dataArray2.push({num: dataArray2.length});
        }

        this.rapidListView2.init();
    }

    onEnable() {
        this.rapidListView1.updateView(20, 0);
        this.rapidListView2.updateView(200, 0);
    }

    addItemData(index: number, num: number) {
        this.dataArray1.splice(index, 0, {num: num});
        this.rapidListView1.addItem(index);
    }

    removeItemData(index: number) {
        this.dataArray1.splice(index, 1);
        this.rapidListView1.removeItem(index);
    }
}
