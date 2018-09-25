const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        // 结束遮罩层
        coverOver: {
            default: null,
            type: cc.Node
        },
        // 分数提示
        prompt: {
            default: null,
            type: cc.Label
        },
    },
    // 打开分享
    openShare() {
        wx.shareAppMessage({
            title: Global.shareInfo.title,
            imageUrl: Global.shareInfo.url,
            // query: `shareScore=${Global.pageInfo.score ? Global.pageInfo.score : 0}`
        });
    },
    // 计算分数
    computeScore(width, x) {
        let num = 0, _w = width / 6, _x = Math.abs(x);

        // 之前的判断
        // if (_x < _w * 3 && _x > _w * 2) {
        //     num = 1;
        // } else if (_x < _w * 2 && _x > _w) {
        //     num = 2;
        // } else if (_x <= _w) {
        //     num = 3;
        // }

        if (_x == 0) {
            num = 3;
        } else if (_x > 0 && _x < _w * 1.5) {
            num = 2
        } else if (_x >= _w * 1.5 && _x < _w * 2.8) {
            num = 1
        }

        // console.log(Math.abs(x), width);
        Global.gameInfo.score += num;
        this.scoreLabel.string = '得分：' + Global.gameInfo.score;
        this.prompt.string = num == 0 ? '踩偏了~' : '+' + num;
        this.prompt.node.y = this.node.y;
        let show = cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 1.2, 1.2));
        let hide = cc.spawn(cc.fadeOut(0.3), cc.scaleTo(0.3, 0.6, 0.6));
        let seq = cc.sequence(show, hide);
        seq.easing(cc.easeOut(3.0));
        this.prompt.node.runAction(seq);
    },
    gameOver(type) {
        // this.overaudio.play();
        Global.game.gameover = true;
        this.coverOver.active = true;
        // let score = Global.gameInfo.score;
        // if (CC_WECHATGAME) {
        //     window.wx.postMessage({
        //         messageType: 3,
        //         MAIN_MENU_NUM: "x1",
        //         score: score,
        //     });
        // }
        this.node.getComponent(cc.RigidBody).gravityScale = 1;
        if (type) {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-300, 0);
        } else {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(300, 0);
        }
        this.coverOver.getChildByName('score').getComponent(cc.Label).string = '分数：' + Global.gameInfo.score;
        cc.director.loadScene('RankingView');
    },
    // 物理引擎碰撞回调
    onBeginContact() {
        if (Global.game.gameover) return;
        // cc.log('落地了');
        Global.game.isClick = false;
        this.node.getComponent(cc.RigidBody).gravityScale = 0;
    },
    // 碰撞组件回调
    onCollisionEnter(other, self) {
        if (Global.game.gameover) return;
        // cc.log(other.node);
        other.node.parent.ismove = false;
        switch (other.node.name) {
            case 'top':
                // cc.log('游戏得分');
                this.node.getComponent(cc.RigidBody).gravityScale = 0;
                this.computeScore(other.node.width, other.node.parent.x);
                Global.game.node.getChildByName('map').getComponent('Map').createBrick();
                other.node.destroy();
                break;
            case 'left':
                // cc.log('撞到左边');
                this.gameOver(true);
                break;
            case 'right':
                // cc.log('撞到右边');
                this.gameOver(false);
                break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
