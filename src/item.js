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
  calc_visible: function(x) {

    if(x > this.x + g_var.ACTIVE_WIDTH || x < this.x - g_var.ACTIVE_WIDTH){
      return false
    }
    return true
  },
  update: function(dt) {

  }
});