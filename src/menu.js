var MenuLayer = cc.Layer.extend({
  ctor:function () {
    this._super();
    this.init();
  },  
  onEnter:function(){
    //must 手动调用父函数，否则各种诡异
    this._super();
    //cc.audioEngine.stopMusic(true);
    //cc.audioEngine.playMusic(res.menu_bgm, true);
    cc.log("onEnter");
  },
  init:function () {
    this._super();
    cc.director.setProjection(cc.Director.PROJECTION_2D);

    this.is_loadding = true;
    var self = this;

    var winSize = cc.director.getWinSize();

    var sp = new cc.Sprite(res.loading_png);
    sp.setAnchorPoint(0, 0);
    this.addChild(sp, 0, 1);
    
    this.titleLabel = new cc.LabelTTF("Loading...", "Arial Black", 50);
    this.titleLabel.setPosition(cc.p(winSize.width / 2, winSize.height / 2 + 80));
    //cannot change ttf bug
    this.titleLabel2 = new cc.LabelTTF("Click & Start", "Arial Black", 50);
    this.titleLabel2.setPosition(cc.p(winSize.width / 2, winSize.height / 2 + 80));
    this.titleLabel2.visible = false;
    this.titleLabel2.enableStroke(cc.color(222, 222, 222, 255), 2)

    this.addChild(this.titleLabel); 
    this.addChild(this.titleLabel2);

    this.titleLabel.visible = true;
    var color = cc.color(0, 254, 218, 22)
    this.titleLabel.setFontFillColor(color);
    this.titleLabel2.setFontFillColor(color);

    //不断闪烁
    //this.titleLabel.opacity = 0;
    
    splitEffect(this.titleLabel, true, null); 
    this.scheduleOnce(function(){
        self.removeChild(self.titleLabel);
        self.titleLabel2.visible = true;
        splitEffect(this.titleLabel2, true, null);
        self.is_loadding = false;
    }, 2.0);
      
      
    var touchListener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
                cc.log('touches_menu fires')
                //var touch = touch;
                //var delta = touch.getDelta();
                self.onNewGame(event);
                //console.log(touch.getLocation());
                return true;
        },
    });        
    cc.eventManager.addListener(touchListener, this);
      //cc.eventManager.addListener(touchListener2, -197); 

    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyReleased: function(keyCode, event){

            if(keyCode == cc.KEY.back)
            {
                self.quit_game();
            }
            else if(keyCode == cc.KEY.menu)
            {
                cc.log('press menu')
            }
        }
    }, this);


    return true;
  },
  quit_game:function (e){
    cc.director.end();
  }, 
  onAbout:function (e){
    /*
      this.onButtonEffect();
      var scene = new cc.Scene();
      scene.addChild(new GameLayer());
      cc.director.runScene(new cc.TransitionFade(1.2, scene));
    */
  },
  onNewGame:function (e){
    if(this.is_loadding == true){
        return false;
    }
    cc.audioEngine.stopMusic(false);
      // cc.LoaderScene.preload(g_maingame, function () {
    //var scene =  new cc.Scene();
    //scene.addChild(new StoryLayer());
    cc.director.runScene(new cc.TransitionFade(1.2, new BattleScene()));
      //}, this);      
  },
  onSettings:function(e){
    /*
    var scene = new cc.Scene();
    scene.addChild(new GameLayer());
    cc.director.runScene(new cc.TransitionFade(1.2, scene));
    //cc.director.replaceScene(cc.TransitionFade(1.2, scene)); 
    */    
  },
  onButtonEffect:function (result) {
    cc.log(result);
  }
});

var MenuScene = cc.Scene.extend({
  onEnter:function () {
    this._super();
    var layer = new MenuLayer(); 
    this.addChild(layer);
    layer.init();
  }
});




