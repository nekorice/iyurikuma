/*
    File: map.js
    Author: necorice
    Date:   2015/8/4
    license: MIT
*/

//extend layer
Map = cc.Layer.extend({
  chapter:0,
  section:0,
  next:null,
  map_list:[],
  map_index:0,
  ctor:function () {
    this._super();
    this.init();
  },
  init:function(){
    //scene config
    //chapter:[chapter_id,section_id]
    //scene_id - > get scene file
    //this.layer = layer;

    //res.scene_map[this.chapter][this.section]
    //this.map_list = res.scene_map[this.chapter];
    
    var loading_maps = res.scene_map[this.chapter].slice(this.section);
    var start_m = 0
    for (var i = 0; i < loading_maps; i++) {
      var tileMap = cc.TMXTiledMap.create(res.map);
      this.addChild(tileMap, 1);
      load_object(tileMap);
      //set x pos
      tileMap.x = start_m
      start_m = start_m + tileMap.width; 
      this.map_list.push(tileMap);
    };
    
    this.current_map = this.map_list[0]
    //this.tileMap = cc.TMXTiledMap.create(res.map);
    
  },
  load_object:function(map){
    //map 也是node 这样滚动map的时候可以直接对应滚动
    //enermy/food 挂载在map上
    //set up enermy
    //map.getObjectGroup("Enermy");
    //set up food
    //map.getObjectGroup("food");
  },
  load_next:function(){
    //动态加载后面的图
    //一次loading完，不做这么复杂的方式
  },
  switch_next:function(){
    //
    this.map_index ++;
    if(this.map_index < this.map_list.length){
      this.current_map = this.map_list[this.map_index];
    }
  },
  roll:function(dleft, dright){
    var pos = this.getPosition();
    if(dright > 0){
      pos.x = pos.x + dright;
    }
    //dleft不判断 不允许地图回滚
    
    if(pos.x >= this.current_map.width){
      this.switch_next();
    }

    this.setPosition(pos);
  },
  roll_middle:function(dx, dy){
    //人物固定中间的地图滚动
    //直接同步人物移动
    //高度是否同步
    var pos = this.getPosition();
    pos.x = dx;
    pos.y = dy;

    if(pos.x >= this.current_map.width){
      this.switch_next();
    }

    this.setPosition(p);
  },
  calc_roll:function(ppos, swidth){
    var dright = g_var['MAP_ROLLING_SPACE'] - (swidth - ppos.x)
    var dleft = g_var['MAP_ROLLING_SPACE'] - ppos.x
    return [dleft,dright]
  },
  update:function(dt){
    
  }
});






