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
        },

        birdPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "小鸟的 Prefab",
        },

        bird: {
            default: null,
            visible: false,
            tooltip: "运行时生成的，当前在画面中的鸟",
        },

        birdUpSpeed: {
            default: 0,
            tooltip: "点击屏幕时，鸟获得的上升速度",
        },

        birdSpeed: {
            default: 0,
            visible: false,
            tooltip: "鸟当前在 y 方向上的速度",
        },

        birdGravitationalAcceleration: {
            default: 0,
            tooltip: "鸟下降的重力加速度",
        }
    },

    // use this for initialization
    onLoad: function () {
        this.setupEventListener();
        // this.setupCollisionListener();
        this.setupBird();
        this.setupPillars();
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
            let x = this.node.width / 2 + this.pillars[0][0].width / 2;
            this.generateTwoPillar(x);
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

        //鸟的当前速度
        this.birdSpeed = this.birdSpeed - this.birdGravitationalAcceleration * dt;
        let birdUpHeight = dt * this.birdSpeed;
        let birdY = this.bird.getPositionY() + birdUpHeight;
        this.bird.setPositionY(birdY);
    },

    /**
     * 生成初始的障碍物
     */
    setupPillars: function () {
        let tmpPillar = cc.instantiate(this.pillarPrefab);
        // 最大可生成的位置
        let maxX = this.node.width / 2 + tmpPillar.width / 2;
        // 记录下最后一次生成位置的下一个位置
        let x = 0;
        for (x = 0; x <= maxX; x+=this.pillarGenerateMargin) {
            this.generateTwoPillar(x);
        }
        // 距离上一个生成位置已经间隔了多远
        this.lastPillarGenerateMargin = maxX - (x - this.pillarGenerateMargin);
    },

    /**
     * 生成一对新的障碍物
     * @param x 障碍物生成的水平位置
     */
    generateTwoPillar: function (x) {
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
        upPillar.setPositionX(x);

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
        downPillar.setPositionX(x);

        // 放到障碍物数组中
        this.pillars.push([upPillar, downPillar]);
    },

    /**
     * 生成初始的小鸟
     */
    setupBird: function () {
        this.bird = cc.instantiate(this.birdPrefab);
        // 初始化位置(x始终不变)
        //x不变
        let x = -200;
        let y = 0;
        this.bird.setPositionX(x);
        this.bird.setPositionY(y);
        this.node.addChild(this.bird);
    },

    /**
     * 初始化系统事件监听
     */
    setupEventListener: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.birdSpeed = this.birdUpSpeed;
            console.log("mouse down");
        }, this);
    },

    /**
     * 初始化碰撞检测
     */
    setupCollisionListener: function () {
        // var manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // manager.enabledDrawBoundingBox = true;
        // manager.enabledDebugDraw = true;
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    // onCollisionEnter: function (other, self) {
    //     console.log('end');
    // },

});
