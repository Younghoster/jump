const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        brick: {
            default: null,
            type: cc.Prefab
        },
        // y轴
        locationY: 0,
        // 方块计数
        count: 0,
    },
    // 创建输出砖块
    createBrick(state) {
        let brick = cc.instantiate(this.brick);
        let type = parseInt(2 * Math.random()) == 1 ? 'toLeft' : 'toRight';
        // 设定标记
        brick.ismove = true;
        brick.dataMove = type;
        // 定位
        brick.x = type == 'toLeft' ? (this.node.width + brick.width) / 2 : -(this.node.width + brick.width) / 2;
        brick.y = this.locationY;
        this.locationY += brick.height;
        // 输出到对应容器
        brick.parent = this.node;
        // if (state) return cc.log('没踩到重置方块');
        this.count += 1;
        if (this.count == 10 && Global.gameInfo.brickSpeed < 20) {
            Global.gameInfo.brickSpeed += 1;
            this.count = 0;
            // console.log('难度上升：' + Global.gameInfo.brickSpeed);
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.locationY = this.node.getChildByName('tray').y;
    },

    start () {

    },

    // update (dt) {},
});
