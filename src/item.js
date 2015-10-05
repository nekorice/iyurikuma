/*
    File: item.js
    Author: necorice
    Date:   2015/10/04
    license: MIT
*/

//cc.SpriteBatchNode
var Item = cc.Sprite.extend({

});


var Yuri = Item.extend({
  nouse:false,
  type:'yuri',
  ctor:function (tileObject, offset) {
    //init img
    this._super(res.flower);
    //come from 2.x
    this.init(tileObject, offset);
  },
  init:function(tileObject, offset){
    cc.log('init yuri');
    this.x = tileObject['x'] + offset;
    this.y = tileObject['y'];
    this.bwidth = tileObject['width'];
    this.bheight = tileObject['height'];

    this.scale = 0.2;
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

  }
});