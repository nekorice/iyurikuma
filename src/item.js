/*
    File: item.js
    Author: necorice
    Date:   2015/10/04
    license: MIT
*/

//require(move.js)
//this is all object in tilemap
//read from tilemap
//loading the data

//cc.SpriteBatchNode
var Item = cc.Sprite.extend({
  type:"item",
  ctor:function (png) {
    this._super(png);
     this.nouse = false;
     this.moveable = false;
  },
  init_base:function(tileObject, offset){
    cc.log('init '+this.type);
    this.x = tileObject['x'] + offset;
    this.y = tileObject['y'];
    this.bwidth = tileObject['width'];
    this.bheight = tileObject['height'];
    
    //锚点设置为左上角
    this.setAnchorPoint(0, 0);
    //默认 visible = false 来添加到界面
    this.visible = false;    
  },
  collide_rect: function(x) {
    return new Rect(this.x, this.y, this.width * this.scale, this.height * this.scale);
  },
  calc_visible: function(x) {
    
    if(this.nouse || x > this.x + g_var.ACTIVE_WIDTH || x < this.x - g_var.ACTIVE_WIDTH){
      return false
    }
    return true
  },
  draw_collide: function(dnode) {
    if(!this._draw){
      //静物只draw一次
      var r = this.collide_rect()
      drawRect(r, dnode);
      this._draw = true;
    }
  },
  destroy: function() {
    this.visible = false;
    this.nouse = true;
    if(this.parent){
      this.parent.removeChild(this, true);
    }else{
      cc.log(this);
      cc.log('parent is null');
    }  
  },
  update: function(dt) {
  
  },
});


var Yuri = Item.extend({
  type:'yuri',
  ctor:function (tileObject, offset) {
    //init img
    this._super(res.flower);
    //come from 2.x
    this.init(tileObject, offset);
  },
  init:function(tileObject, offset){

    this.scale = 0.2;
    this.init_base(tileObject, offset); 
  },
});

var Trap = Item.extend({
  type:'trap',
  ctor:function (tileObject, offset) {
    //init img
    this._super(res.trap);
    //come from 2.x
    this.init(tileObject, offset);
  },
  init:function(tileObject, offset){
    this.init_base(tileObject, offset); 
    this.scale = 0.4;
  },  
}) 

var Bridge = Item.extend({
  type:'bridge',
  ctor:function (tileObject, offset) {
      //init img
      this._super(res.bridge);
      //come from 2.x
      this.init(tileObject, offset);
    },
    init:function(tileObject, offset){
      this.init_base(tileObject, offset);
      this.scale = 1;
      this.speed = 60;
      this.mover = PathMoveFactory(this.getPosition(), this.speed, tileObject['move_tp']);
      this.passenger = [];
      var self = this;
      g_var.emitter.addListener('downBridge', function(p){
        if(self.visible){
          self.downObject(p);
        }     
      })
    },
    attachObject: function(player){
      //要求 player 有 move Specail方法 
      //不使用 event 主要监听效率不高
      this.passenger.push(player);
    },
    downObject: function(player){
      var index = this.passenger.indexOf(player);
      if(index != -1){
        this.passenger.splice(index, 1);
      } 
    },
    movePassenger: function(x, y){
      for (var i = this.passenger.length - 1; i >= 0; i--) {
        this.passenger[i].moveSpecial(x, y)
      };
    },
    update: function(dt) {
      var last = this.getPosition();
      var position = this.mover.move(dt);
      this.setPosition(position);
      this.movePassenger(this.x - last.x, this.y - last.y);
    },    
})

var Door = Item.extend({
  type:'door',
  ctor:function (tileObject, offset) {
      //init img
      this._super(res.door);
      //come from 2.x
      this.init(tileObject, offset);
  },
  init:function(tileObject, offset){
    this.init_base(tileObject, offset);
    
    this.isopen = false;
    //直接配置在地图上
    this.key = tileObject['key'];
    //add event listen
    //g_var.emitter.addListener('open_door', this.open_door);
    this.bind_open_door();
  },
  bind_open_door:function(){
    
    //使用闭包来实现  防止apply 针对 listen 使用非this 调用
    var dkey = this.key;
    var self = this;

    g_var.emitter.addListener('open_door', function (key){
      cc.log("that fires")
      if(key == dkey){
        self.isopen = true;
        self.nouse = true;
        //切换到开门的png
        self.destroy();
        //self.initWithSpriteFrameName('fire1.png')
        //var spriteFrame = cc.spriteFrameCache.getSpriteFrame("grossini_dance_01.png");
        //setDisplayFrame() initWithSpriteFrameName()        
      }
    });

  },
  update: function(dt) {
    //this.move 
    //按照设定的路线
  },    
})

//静物可以通用一个类
var Key = Item.extend({
  type:'key',
  ctor:function (tileObject, offset) {
    //init img
    this._super(res.key);
    this.init(tileObject, offset);
  },
  init:function(tileObject, offset){

    this.init_base(tileObject, offset);
    this.key = tileObject['key'];
    this.scale = 0.3;

  },
  use:function(){
    cc.log('emitter open_door')
    g_var.emitter.emit('open_door', this.key)
  },
});