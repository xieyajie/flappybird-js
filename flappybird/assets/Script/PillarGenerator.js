cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        pillarPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "柱子障碍物的 Prefab",
        },

        pillarSapce: {
            default: 0,
            tooltip: "上下障碍物的中间空隙间距",
        },
    },

    // use this for initialization
    onLoad: function () {
        this.generateTwoPillar();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    generateTwoPillar: function () {
        // 障碍物间隙中心位置上下
        let spaceCenterY = Math.random() * this.node.height - this.node.height/2;

        // 上边的柱子障碍物
        let upPillar = cc.instantiate(this.pillarPrefab);
        this.node.addChild(upPillar);

        // 上边障碍物的下边缘位置
        let upPillarDownY = spaceCenterY + this.pillarSapce / 2;
        // 上边障碍物的高度
        let upPillarHeight = this.node.height / 2 - upPillarDownY;
        // 设置上边障碍物的位置大小
        upPillar.height = upPillarHeight;
        upPillar.setPositionY(upPillarDownY + upPillarHeight / 2);

        // 下边的柱子障碍物
        let downPillar = cc.instantiate(this.pillarPrefab);
        downPillar.rotation = 180;
        this.node.addChild(downPillar);

        // 下边障碍物的上边缘位置
        let downPillarUpY = spaceCenterY - this.pillarSapce / 2;
        // 下边障碍物的高度
        let downPillarHeight = this.node.height / 2 + upPillarDownY;
        // 设置下边障碍物的位置大小
        downPillar.height = downPillarHeight;
        downPillar.setPositionY(downPillarUpY - downPillarHeight / 2);
    },
});
