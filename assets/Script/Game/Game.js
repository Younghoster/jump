const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 主角
        player: {
            default: null,
            type: cc.Node
        },
        // 开始遮罩层
        coverStart: {
            default: null,
            type: cc.Node
        },
        cover: {
            default: null,
            type: cc.Node
        },
        // player点击
        isClick: false,
        jumpaudio: cc.AudioSource,
        backaudio: cc.AudioSource,
    },
    // 再次游戏
    playeAgain() {
        cc.director.loadScene('Game');
    },
    // 开始游戏
    startGame() {
        this.cover.active = true;
        this.coverStart.active = false;
        this.node.getChildByName('camera').getComponent('Camera').ismove = true;
    },
    // showRank () {
    //     // GameUiTools.loadingLayer("GameOver");
    //     this.loadingLayer("panel/GameOver");
    //     console.log('rank')
    // },
    // 点击跳跃
    jump() {
        if (this.gameover || this.isClick) return;
        this.isClick = true;
        this.jumpaudio.play();
        /**
         * 当速度最快为20时，初始速度为 900
         * 当速度最慢为5时， 初始速度为 1100
         */
        let value = (1100 - 900) / (20 - 5);
        let ss = 1100 - (Global.gameInfo.brickSpeed - 5) * value;
        // console.log('初始速度：', ss);
        // 开始播放骨骼跳跃动画
        this.player.getComponent(dragonBones.ArmatureDisplay).playAnimation('jump', 1);
        // 设置重力
        this.player.getComponent(cc.RigidBody).gravityScale = 1;
        this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, ss);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameover = true;
        Global.game = this;
        Global.gameInfo.score = 0;
        Global.gameInfo.brickSpeed = 5;
        // this.getUserInfo();
        this.getshareAd();
        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;
        // 设置引力
        cc.director.getPhysicsManager().gravity = cc.v2(0, -2600);
        // 开启碰撞系统
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.backaudio.play();
    },

    start () {
        this.node.on('touchstart', this.jump, this);
        if (window.wx) {
            // 显示分享按钮
            wx.showShareMenu();
            // 设置转发分内容
            wx.onShareAppMessage(res => {
                // console.log('监听分享内容', res);
                return {
                    title: Global.shareInfo.title,
                    imageUrl: Global.shareInfo.url,
                }
            });
        }
    },
    getshareAd: function () {
        var url="";//动态分享图地址
        var xhr = new XMLHttpRequest();
        // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response)
                // var obj = JSON.parse(response);
                // Global.shareInfo.title = obj.data.slogan
                // Global.shareInfo.url = obj.data.coverimage
            }
        };
        xhr.open("POST", url, true);
        //var str={"name":"1","password":"2"}
        xhr.send();
    },
    btnshare: function (event) {
        this.getshareAd();
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                title: Global.shareInfo.title,
                imageUrl: Global.shareInfo.url,
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: "x1",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            // cc.log("获取群排行榜数据。x1");
        }
    },
    btnRank: function (event) {
        cc.director.loadScene('RankingView');
    },
    btnMoreGame: function (event) {
        if (CC_WECHATGAME) {
            window.wx.navigateToMiniProgram({
                appId: 'wx90293eb00e3f0951'
            });
        } else {
            // cc.log("打开鱼乐玩吧失败");
        }
    },
    getUserInfo() {
        wx.getUserInfo({
            success: function(res) {
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province
                var city = userInfo.city
                var country = userInfo.country
            }
        })
    }
    // update (dt) {},
});
