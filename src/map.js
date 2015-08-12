/*
    File: map.js
    Author: necorice
    Date:   2015/8/4
    license: MIT
*/

Map = cc.Class.extend({
  chapter:0,
  section:0,
  next:null,
  ctor:function (layer) {
    if(this._super){
      this._super(layer);
    } 
    this.init(layer);
  },
  init:function(layer){
    //scene config
    //chapter:[scene_id,scene_id]
    //scene_id - > get scene file

    this.tileMap = cc.TMXTiledMap.create(res.map);
    //this._tileMap = tileMap;
    layer.addChild(this._tileMap, 1, 0);
  },
  load_next:function(){
    //
  },
  switch_next:function(){
    //


  },
  roll_right:function(d){
    //if right > this.tileMap
    //switch_nex

    //if not right
    //not rolling
  },
  roll_left:function(d){
    //if left = 0
    //return 
    

  },
  rolling:function(d){

  }
});




