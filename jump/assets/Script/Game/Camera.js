const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 设置一个目标为摄像机的中心点
        target: {
            default: null,
            type: cc.Node
        },
        // 监控摄像机一开始缩放值
        ismove: false
    },
    cameraMove() {
        if (!this.ismove) return;
        this.camera.zoomRatio -= 0.01;
        if (this.camera.zoomRatio <= 1) {
            this.camera.zoomRatio = 1;
            this.ismove = Global.game.gameover = false;
            Global.game.node.getChildByName('map').getComponent('Map').createBrick();
        }
    },
    // LIFE-CYCLE CALLBACKS:

    /**
     * 当组件的 enabled 属性从 false 变为 true 时，或者所在节点的 active 属性从 false 变为 true 时，会激活 onEnable 回调。
     * 倘若节点第一次被创建且 enabled 为 true，则会在 onLoad 之后，start 之前被调用。
     */
    onEnable() {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    },

    /**
     * 当组件的 enabled 属性从 true 变为 false 时，或者所在节点的 active 属性从 true 变为 false 时，会激活 onDisable 回调。
     */
    onDisable() {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    },

    onLoad() {
        this.ismove = false;
        this.camera = this.getComponent(cc.Camera);
    },

    start() {

    },

    update(dt) {
        // 监测目标设为中心点
        if (this.target.y >= 0) this.node.y = this.target.y;
        this.cameraMove();
    },
});
