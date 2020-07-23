import RapidListView from "./rapidListView/RapidListView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(RapidListView)
    menuRapidListView: RapidListView = null;

    @property(cc.Node)
    view: cc.Node = null;

    @property(cc.Node)
    back: cc.Node = null;

    @property(cc.Node)
    menu: cc.Node = null;

    @property(cc.Prefab)
    viewArray: cc.Prefab[] = [];

    private viewMap: Object = Object.create(null);
    private showIndex: number = null;]
    private buttonList: any[];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.mainScene = this;
        this.back.active = false;

        let buttonList = [
            {text: "垂直滚动列表"},
            {text: "水平滚动列表"},
            {text: "聊天"},
            {text: "增删Item"},
        ];

        this.menuRapidListView.init(index => {
            return buttonList[index];
        });

        this.menuRapidListView.addListenItemEvent(this.onItemEvent.bind(this));
        this.buttonList = buttonList;
        this.menuRapidListView.updateView(this.buttonList.length, 0);
    }

    onEnable() {
        this.back.on("click", this.onClickBack, this);
    }

    onDisable() {
        this.back.off("click", this.onClickBack, this);
    }

    onItemEvent(type, data) {
        cc.log("item event ", type, data);
        this.showView(data);
    }

    showView(index) {
        let node = this.viewMap[index];

        if(!node) {
            node = cc.instantiate(this.viewArray[index]);
            this.view.addChild(node);

            this.viewMap[index] = node;
        }

        this.showIndex = index;
        this.back.active = node.active = true;
        this.menu.active = false;
    }

    onClickBack() {
        this.back.active = this.viewMap[this.showIndex].active = false;
        this.menu.active = true;
        this.menuRapidListView.updateView(this.buttonList.length, 0);
    }


    // update (dt) {}
}
