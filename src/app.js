/*
    File: app.js
    Author: necorice
    Date:   2015/7/20
    license: MIT
*/

var Battle = cc.Layer.extend({
    isMouseDown:false,
    sprite:null,
    //start index
    spriteFrameIndex:0,

    init:function () {

        this._super();

        var size = cc.director.getWinSize();
        //maybe some problem
        cc.director.setProjection(cc.Director.PROJECTION_2D);
        cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL = 1;

        //this.setAntiAliasTexParameters()
        
        //静态的不经常更新的层

        //playmusic
        //cc.audioEngine.playMusic(res.bgm, true);
        
        //add background image load chapter
        /*
        var back = new cc.Sprite(res.background);
        back.setPosition(size.width / 2, size.height / 2);
        //back.setScale(0.5);
        this.addChild(back);
        */
        
        //如果addChild undefined 就会报错 already add
        //Map
        this.map = new Map(size);
        this.addChild(this.map, 1);

        //tiled map test
        //tiled map 有1像素的bug 需要多留一个像素 比如32px 填写31px 边框0 设置间距1
        //var tileMap = cc.TMXTiledMap.create(res.map);
        //this._tileMap = tileMap;
        //this.addChild(this._tileMap, 1, 0);

        //从tilemap上读取信息

        // 获得对象层
        var objectLayer = this.map.current_map.getObjectGroup("player");
        var array = objectLayer.getObjects();

        //获得对象的点
        //只能够获得数组 需要用name来区分
        var spawnPoint = array[0];
        var objX = spawnPoint["x"];
        var objY = spawnPoint["y"];
        var width = spawnPoint["width"];
        var height = spawnPoint["height"]; 
        cc.log(spawnPoint["name"])
        cc.log(objX);
        cc.log(objY);
        //var pleft = array[1];
       
        //200 -> test
        this.player = new Player(cc.p(objX,objY));
        //player应当挂接到map上
        this.map.addChild(this.player);

        this.init_lisener();
        this.upon_tile(this._tileMap);

        //scene 
        //story scene && menu
        //battle scene && menu
        //menu scene

        this.scheduleUpdate();
        this.schedule(this.update);

        return true;
    },
    init_lisener:function(){
        //键盘监听
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:function(keyCode, event){
                self.player.pressKey(keyCode, true);
                //self.onKeyDown(keyCode);
            },
            onKeyReleased: function(keyCode, event){
                //self.onKeyUp(keyCode);
                self.player.pressKey(keyCode, false);
                if(keyCode == cc.KEY.back)
                {
                    self.back_menu();
                }
                else if(keyCode == cc.KEY.menu)
                {
                    cc.log('press menu')
                }
            }
        }, this);       

    },
    upon_tile:function(tilemap){

    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.director.end();
    },
    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
        console.log('touches start');
        console.log(touches);

    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                console.log(touches)
                //this.circle.setPosition(touches[0].getLocation().x, touches[0].getLocation().y);
                //this._jetSprite.handleTouchMove(touches[0].getLocation());
            }
        }
    },
    update:function(dt){
        //sprite.update
        //设定每一帧
        //this.sprite.update(dt);
        var ppos = this.player.update(dt);

        //use this auto follow player
        //this.map.runAction(cc.follow(this.player));

        //map update dt
        this.map.update(dt, ppos);


    },    
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    }
});


var BattleScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Battle();
        
        this.addChild(layer);
        layer.init();
    }
});
