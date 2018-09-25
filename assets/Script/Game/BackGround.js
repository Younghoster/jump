cc.Class({
    extends: cc.Component,
 
    properties: {
       far_bg:[cc.Node],
       far_speed:0.2,
    },
 
   onLoad :function() {
       this.fixBgPos(this.far_bg[0],this.far_bg[1]);
   },
 
   fixBgPos:function(bg1,bg2){
       bg1.x = 0;
       //利用前一张图片的边框大小设置下一张图片的位置
       var bg1BoundingBox = bg1.getBoundingBox();
       bg2.setPosition(bg1BoundingBox.xMin,bg1BoundingBox.yMax)
   },
 
   update:function(dt){
       this.bgMove(this.far_bg,this.far_speed);
       this.checkBgReset(this.far_bg);
   },
 
   bgMove:function(bgList,speed){
       for(var index = 0; index < bgList.length; index++){
           var element = bgList[index];
           element.y -= speed;
       }
   },
   //检查是否要重置位置
    checkBgReset:function(bgList){
        var winSize = cc.director.getWinSize();
        var first_yMax = bgList[0].getBoundingBox().yMax;
        if(first_yMax<=0){
            var preFirstBg = bgList.shift();
            bgList.push(preFirstBg);
            var curFirstBg = bgList[0];
            preFirstBg.y = curFirstBg.getBoundingBox().yMax;
        }
    }
    
});
