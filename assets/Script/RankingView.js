// const Global = require("Global")
cc.Class({
    extends: cc.Component,
    name: "RankingView",
    properties: {
        score: {
            default: null,
            type: cc.Label
        },
        maxRank: cc.Node,
        groupRank: cc.Node,
        restart: cc.Node,
        share: cc.Node,
        moregame: cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
        back: cc.Node,
        seeGround: cc.Node,
        cover: cc.Node,
        overaudio: cc.AudioSource,
    },
    onLoad() {
        this.getshareAd()
        this.overaudio.play()
    },
    start() {
        // let score = Global.gameInfo.score;
        let score = '1';
        this.score.string = score;
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score: score,
            });
            window.wx.postMessage({
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        }
    },
    btnmaxRank(event) {
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            // cc.log("获取好友排行榜数据。x1");
        }
        this.back.active = true;
        this.seeGround.active = true;
        this.cover.active = false;
        this.maxRank.active = false;
        this.groupRank.active = false;
        this.restart.active = false;
        this.share.active = false;
        this.moregame.active = false;
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

    btnminRank: function (event) {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            // cc.log("获取横向展示排行榜数据。x1");
        }
        this.back.active = false;
        this.seeGround.active = false;
        this.cover.active = true;
        this.maxRank.active = true;
        this.groupRank.active = true;
        this.restart.active = true;
        this.share.active = true;
        this.moregame.active = true;
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
    submitScoreButtonFunc(){
        // let score = Global.gameInfo.score;
        // if (CC_WECHATGAME) {
        //     window.wx.postMessage({
        //         messageType: 3,
        //         MAIN_MENU_NUM: "x1",
        //         score: score,
        //     });
        // } else {
        //     cc.log("提交得分: x1 : " + score)
        // }
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update() {
        this._updateSubDomainCanvas();
    },
    btnrestart() {
        cc.director.loadScene('Game');
    },
    getshareAd: function () {
        var url="";
        var xhr = new XMLHttpRequest();
        // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var obj = JSON.parse(response);
                Global.shareInfo.title = obj.data.slogan
                Global.shareInfo.url = obj.data.coverimage
            }
        };
        xhr.open("GET", url, true);
        //var str={"name":"1","password":"2"}
        xhr.send();
    },
});
