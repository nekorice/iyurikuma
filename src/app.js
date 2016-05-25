/*
  File: app.js
  Author: necorice
  Date:   2015/7/20
  license: MIT
*/

var Battle = cc.LayerColor.extend({
  isMouseDown:false,
  sprite:null,
  //start index
  spriteFrameIndex:0,
  //collide
  _activeNode:[],
  //ui
  passTime:0,
  //battle pause story
  state:'battle',
  //active entity
  enermies:[],

  init:function () {

    this._super(cc.color(179, 205, 255, 255));

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
    
    //全局变量
    g_var['bulletpoll'] = new BulletPool()

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
    var objectLayer = this.map.current_map.getObjectGroup('player');
    //var array = objectLayer.getObjects();

    //获得对象的点
    //只能够获得数组 需要用name来区分
    var spawnPoint = objectLayer.objectNamed('player');
    var objX = spawnPoint['x'];
    var objY = spawnPoint['y'];
    //var width = spawnPoint['width'];
    //var height = spawnPoint['height']; 
    cc.log(spawnPoint['name'])
    cc.log(objX);
    cc.log(objY);
    //var pleft = array[1];
     
    this.player = new Player(cc.p(objX,objY));
    //player应当挂接到map上
    this.map.addChild(this.player);
    this.map.player = this.player;

    //load enemy 
    
    var ep = objectLayer.objectNamed('enermy');
    var tm = new Enemy(cc.p(ep['x'], ep['y']))
    //enermy 在 map 中管理,还是在 app 中管理
    this.enermies.push(tm)
    this.map.addChild(tm)
    cc.log("init enemy:" + ep['x'], ep['y'])
    
    this.init_lisener();

    //scene 
    //story scene && menu
    //battle scene && menu
    //menu scene

    //load battle ui
    this._ui = ccs.uiReader.widgetFromJsonFile(res.battle_ui);
    //手动居中  960 640
    this._ui.setPosition(cc.p(size.width / 2 - g_var.DSWIDTH/2, size.height/2 - g_var.DSHEIGHT/2));
    this._ui.zIndex = 99;
    this.addChild(this._ui);

    var battlePanel = this.getChildByName('battlePanel');
    this.lbtime = battlePanel.getChildByName('lbtime');
    this.lbscore = battlePanel.getChildByName('lbscore');
    this.lbscore.setString(0);
    this.btnPause = battlePanel.getChildByName('pauseBtn');
    this.pausePanel = battlePanel.getChildByName('pausePanel');
    this.hpArray = [
      battlePanel.getChildByName('hp1'),
      battlePanel.getChildByName('hp2'),
      battlePanel.getChildByName('hp3'),
      battlePanel.getChildByName('hp4'),
    ]
    //btn onclick
    this.btnPause.addTouchEventListener(this.onPause, this);

    this.scheduleUpdate();
    //this.schedule(this.update);
    this.schedule(this.clock, 1)

    return true;
  },
  clock:function(){
    if(this.state != 'battle'){
      return false;
    }
    this.passTime++;
    var minute = parseInt(this.passTime / 60);
    var seconds = this.passTime % 60;
    this.lbtime.setString(minute+ ':' + seconds);
  },
  showHp:function(hp){
    for (var i = 3; i >= hp && i >= 0; i--) {
      this.hpArray[i].visible = false;
    };
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
        if(keyCode == cc.KEY.back) {
          self.back_menu();
        }
        else if(keyCode == cc.KEY.menu) {
          cc.log('press menu')
        }
        else if(keyCode == cc.KEY.b) {
          g_var.DEBUG = !g_var.DEBUG;
        }

      }
    }, this); 

    //触屏监听 
    var self = this;
    var touch_listener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ALL_AT_ONCE,
      swallowTouches: true,
      onTouchesBegan: function (touches, event) {
        return true
      },            
      onTouchesMoved: function (touches, event) {                
        /*
        for (var i=0; i < touches.length;i++ ) {
          var touch = touches[i];
          //self.onMouseMove(touch);
        }*/
      },
      onTouchesEnded: function (touches, event){
        self.onTouchesEnded(touches, event);
      } 
    });     

    cc.eventManager.addListener(touch_listener, this);

  },
  onPause: function() {
    if(this.state == 'battle'){
      this.state = 'pause';
      this.pausePanel.visible = true;
    }   
  },
  onResume: function() {
    this.state = 'battle';
    this.pausePanel.visible = false;
  },
  // a selector callback
  menuCloseCallback:function (sender) {
    cc.director.end();
  },
  activeObject: function(node) {
    if(!node.visible){
      node.visible = true;
      this._activeNode.push(node);
    }
  },
  unactiveObject: function(node, force) {
    if(node.visible || force){
      node.visible = false;
      var index = this._activeNode.indexOf(node);
      this._activeNode.splice(index, 1);
    }
  },
  collide: function() {
    //cc.log(this._activeNode)
    //每一帧只判断一定数量
    for (var i = this._activeNode.length - 1; i >= 0; i--) {  
      //do collide with player
      var re = this.player.doCollide(this._activeNode[i].collide_rect()); 
      if(re){
        //碰撞了
        this.player.boom(this._activeNode[i], this);
        this.unactiveObject(this._activeNode[i], true);
      }  
    };

    //player 碰撞 activeObejct [ item, bullet, enermy ]
    //enermy 碰撞 playerBullet
  },
  update:function(dt){
    //sprite.update
    //设定每一帧
    if(this.state != 'battle'){
      return 
    }
    var ppos = this.player.update(dt);
    //use this auto follow player
    //this.map.runAction(cc.follow(this.player));
    for (var i = this.enermies.length - 1; i >= 0; i--) {
      this.enermies[i].update(dt);
    };

    //map update dt
    this.map.update(dt, ppos);

    //check collide
    this.collide();

  },
  onTouchesBegan:function (touches, event) {
   cc.log('touches start');
  },
  onTouchesMoved:function (touches, event) {
    if (this.isMouseDown) {
      if (touches) {
        cc.log(touches)
        //this.circle.setPosition(touches[0].getLocation().x, touches[0].getLocation().y);
        //this._jetSprite.handleTouchMove(touches[0].getLocation());
      }
    }
  },    
  onTouchesEnded:function (touches, event) {
    //this.isMouseDown = false;
    cc.log('end')
    if(this.state == 'pause'){
      this.onResume();
      cc.log('resume')
    }
  },
  onTouchesCancelled:function (touches, event) {
    cc.log('onTouchesCancelled');
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
