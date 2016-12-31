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

    },

    // use this for initialization
    onLoad: function () {
        // 上边的柱子障碍物
        let upPillar = cc.instantiate(this.pillarPrefab);
        upPillar.setPositionY(upPillar.height / 2);
        this.node.addChild(upPillar);

        // 下边的柱子障碍物
        let downPillar = cc.instantiate(this.pillarPrefab);
        downPillar.rotation = 180;
        downPillar.setPositionY(-downPillar.height / 2);
        this.node.addChild(downPillar);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
