const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    resetBrick() {
        Global.game.node.getChildByName('map').getComponent('Map').locationY -= this.node.height;
        Global.game.node.getChildByName('map').getComponent('Map').createBrick(true);
        this.node.destroy();
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        if (Global.game.gameover) return;
        if (this.node.dataMove == 'toLeft' && this.node.ismove) {
            this.node.x -= Global.gameInfo.brickSpeed;
            
            // 只到中间停止
            // if (this.node.x <= 0) {
            //     this.node.x = 0;
            //     this.node.ismove = false;
            // }
            
            // 超出屏幕重置方块
            if (this.node.x <= (Global.game.node.width + this.node.width) / -2) this.resetBrick();
        } else if (this.node.dataMove == 'toRight' && this.node.ismove) {
            this.node.x += Global.gameInfo.brickSpeed;

            // 只到中间停止
            // if (this.node.x >= 0) {
            //     this.node.x = 0;
            //     this.node.ismove = false;
            // }

            // 超出屏幕重置方块
            if (this.node.x >= (Global.game.node.width + this.node.width) / 2) this.resetBrick();
        }
    },
});
