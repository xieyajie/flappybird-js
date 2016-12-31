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

        pillarMinHeight: {
            default: 0,
            tooltip: "上下预留给障碍物的最小高度",
        },

        pillarMoveSpeed: {
            default: 0,
            tooltip: "障碍物的移动速度",
        },

        pillarGenerateMargin: {
            default: 0,
            tooltip: "间隔多远生成一次障碍物",
        },

        pillars: {
            default: [],
            visible: false,
            tooltip: "记录所有障碍物的数组",
        },

        lastPillarGenerateMargin: {
            default: 0,
            visible: false,
            tooltip: "距离上一次生成障碍物间隔了多远了",
        }
    },

    // use this for initialization
    onLoad: function () {
        this.generateTwoPillar();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // 本次更新移动的距离
        let dtSpace = dt * this.pillarMoveSpeed;

        // 移动各个障碍物
        for (let i = 0; i < this.pillars.length; i++) {
            let pillarArr = this.pillars[i];
            let upPillar = pillarArr[0];
            let downPillar = pillarArr[1];

            upPillar.x -= dtSpace;
            downPillar.x -= dtSpace;
        }

        // 记录距离上一次生成障碍物间隔了多远了
        this.lastPillarGenerateMargin += dtSpace;

        // 检查是否需要生成新的障碍物
        if (this.lastPillarGenerateMargin >= this.pillarGenerateMargin) {
            // TODO：这里会有误差的应该
            this.generateTwoPillar();
            this.lastPillarGenerateMargin = 0;
        }

        // 离开屏幕的障碍物的清理
        for (let i = 0; i < this.pillars.length; i++) {
            let pillarArr = this.pillars[i];
            let upPillar = pillarArr[0];
            let downPillar = pillarArr[1];

            let minX = -this.node.width / 2 - upPillar.width / 2;
            if (upPillar.x < minX) {
                this.pillars.shift();
                upPillar.removeFromParent();
                downPillar.removeFromParent();
            }
        }
    },

    /**
     * 生成一对新的障碍物
     */
    generateTwoPillar: function () {
        // 障碍物间隙中心位置上下
        // 这里已经照顾到了上下障碍物都有个最小高度
        let effectHeight = this.node.height - this.pillarMinHeight * 2 - this.pillarSapce;
        let spaceCenterY = Math.random() * effectHeight - effectHeight / 2;

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
        upPillar.setPositionX(this.node.width / 2 + upPillar.width / 2);

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
        downPillar.setPositionX(this.node.width / 2 + downPillar.width / 2);

        // 放到障碍物数组中
        this.pillars.push([upPillar, downPillar]);
    },
});
