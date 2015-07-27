/****************************************************************************

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 Cocos2d-js v3.0 final
 ****************************************************************************/

var Battle = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    walk_prefix:"data_character_yuyuko_walkFront0",
    back_prefix:"data_character_yuyuko_walkBack0",
    sprite:null,
    //start index
    spriteFrameIndex:0,

    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var size = cc.director.getWinSize();
        //maybe 问题之所在
        cc.director.setProjection(cc.DIRECTOR_PROJECTION_2D);
        

        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, 0);
        // add the label as a child to this layer
        //this.addChild(this.helloLabel, 5);
        
        //静态的不经常更新的层
        //var lazyLayer = cc.Layer.create();
        //this.addChild(lazyLayer);

        //this.setTouchEnabled(true);
        //this.setKeyboardEnabled(true);

        //playmusic
        cc.audioEngine.playMusic(res.bgm, true);

        //add background image
        var back = new cc.Sprite(res.background);
        back.setPosition(size.width / 2,size.height / 2);
        back.setScale(1.5);
        this.addChild(back);

        //tiled map test
        //tiled map 有1像素的bug 需要多留一个像素 比如32px 填写31px 边框0 设置间距1
        var tileMap = cc.TMXTiledMap.create(res.map);
        this._tileMap = tileMap;
        this.addChild(this._tileMap, 1, 0);



        //this.sprite = new player_uuz();
        //this.sprite._tmx = this._tileMap;
        //this.addChild(this.sprite, this.sprite.zOrder);
        
        this.scheduleUpdate();
        this.schedule(this.update);

        //从tilemap上读取信息

        // 获得对象层
        
        var objectLayer = tileMap.getObjectGroup("player");
        var array = objectLayer.getObjects();

        //获得对象的点
        var spawnPoint = array[0];
        var objX = spawnPoint["x"];
        var objY = spawnPoint["y"];
        var width = spawnPoint["width"];
        var height = spawnPoint["height"]; 
        cc.log(spawnPoint["name"])
        cc.log(objX);
        cc.log(objY);

        var pleft = array[1];
       

        //test 骨骼动画
        //manager 管理 预加载
        armatureDataManager= ccs.armatureDataManager;
        //load json
        //add plist and png in resource.js
        armatureDataManager.addArmatureFileInfo(res.kumarun);
        armatureDataManager.addArmatureFileInfo(res.kumaswing);
        //see name in json
        //return ccs.ArmatureAnimation
        var armature = ccs.Armature.create("kumarun");
        var kumaswing = ccs.Armature.create("swing");
        //see action
        //armature.getAnimation().playWithIndex(2);
        armature.getAnimation().play('run');
        kumaswing.getAnimation().play('swing');
        //armature.stop()
        //armature.pause()
        armature.x = objX;
        armature.y = objY;

        kumaswing.x = pleft["x"]
        kumaswing.y = pleft["y"]
        kumaswing.scale = 0.6;
        //armature.scale = 0.6;
        armature.setZOrder(999);
        //反向
        armature.setScaleX(-0.6);
        armature.scaleY = 0.6
        this.addChild(armature); 
        this.addChild(kumaswing);



        //键盘监听
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:function(keyCode, event){
                self.onKeyDown(keyCode);
            },
            onKeyReleased: function(keyCode, event){

                self.onKeyUp(keyCode);
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

        
        this.upon_tile(this._tileMap)

        return true;
    },
    upon_tile:function(tilemap){
        /*
        this = tilemap
        this.obstacles = [];
        var mapWidth = tilemap.getMapSize().width;
        var mapHeight = tilemap.getMapSize().height;
        var tileWidth = tilemap.getTileSize().width;
        var tileHeight = tilemap.getTileSize().height;
        var collidableLayer = this.getLayer("collidable");
        var i, j;
        for (i = 0; i < mapWidth; i++){
            for (j = 0; j < mapHeight; j++){
                var tileCoord = new cc.Point(i, j);
                var gid = collidableLayer.getTileGIDAt(tileCoord);
                if(gid) {
                    var tileXPositon = i * tileWidth;
                    var tileYPosition = (mapHeight * tileHeight) - ((j+1) * tileHeight);
                    var react = cc.rect(tileXPositon, tileYPosition, tileWidth, tileHeight);
                    this.obstacles.push(react);
                }
            }
        } 

       
        the map is 
        0,0  1,0 x+
        0,1  1,1
        y+

        jump and collide
        */
        var mapWidth = tilemap.getMapSize().width;
        var mapHeight = tilemap.getMapSize().height;
        var tileWidth = tilemap.getTileSize().width;
        var tileHeight = tilemap.getTileSize().height;               
        var pos = this.getPosition();
        //get this tile layer
        var line = parseInt(pos.x / tileWidth) + 1;
        var column = mapHeight - parseInt(pos.y / tileHeight);
        //console.log(line);
        //console.log(column);

        var collidableLayer = tilemap.getLayer("collide");
        var gid = collidableLayer.getTileGIDAt(3,16);
        cc.log(gid);
        properties = tilemap.getPropertiesForGID(gid);
        //done
        if(properties != undefined)
            cc.log(properties["collide"] == 1);
        //return 
        //if return true
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

    },
    //for key
    onKeyDown:function(e){
       //handle sprit move
       this.sprite.handleKey(e);
       g_var.KEYS[e] = true;
       /*
       if(e == cc.KEY.left || e == cc.KEY.right){
            
            var prevPrefix = this.spriteFrameNamePrefix;
            if(e == cc.KEY.left)
                this.spriteFrameNamePrefix = this.back_prefix;
            else
                this.spriteFrameNamePrefix = this.walk_prefix;
            if(prevPrefix !== this.spriteFrameNamePrefix)
                this.spriteFrameIndex = 0;
            

            if(this.spriteFrameIndex > 5)
                this.spriteFrameIndex = 0;
            var indexAsString;
            if(this.spriteFrameIndex < 10)
                indexAsString = "0" + this.spriteFrameIndex.toString();
            else
                indexAsString = this.spriteFrameIndex.toString();

            this.removeChild(this.sprite);
            this.sprite  = cc.Sprite.createWithSpriteFrameName(
                this.spriteFrameNamePrefix + indexAsString + ".png"
            );

            this.sprite.setPosition(new cc.Point(300,300));
            this.sprite.setScale(1);
            this.addChild(this.sprite, 2, 0);
            this.spriteFrameIndex++;
        }
        */
    },
    onKeyUp:function (e) {
         g_var.KEYS[e] = false;
         cc.log('key release')
    },    
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
        //this._jetSprite.handleTouch(touches[0].getLocation());

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
