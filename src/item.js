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
      this.scale = 0.3;
      this.mover = PathMoveFactory(tileObject['move_tp']);
      this.passenger = [];
    },
    attachObject: function(player){
      //叠加当前的移动到player身上
      //接受对应的bridge 发来的move消息。
    },
    update: function(dt) {
      var last = this.position;
      this.postion = this.mover.move()

      //emiiter --> this.position - last
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
    //g_var.Emitter.addListener()
  },
  open_door:function(key){
    
    if(key == this.key){
      //
      this.isopen = true;
      this.nouse = true;
      //切换到开门的png
    }
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
    
  },
});