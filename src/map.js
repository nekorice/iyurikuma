/*
    File: map.js
    Author: necorice
    Date:   2015/8/4
    license: MIT
*/

//extend layer
var Map = cc.Layer.extend({
  chapter:0,
  section:0,
  next:null,
  map_list:[],
  map_index:0,
  ctor:function (swidth) {
    this._super();
    this.init(swidth);
  },
  init:function(swidth){
    this.swidth = swidth;
    //scene config
    //chapter:[chapter_id,section_id]
    //scene_id - > get scene file
    //this.layer = layer;

    //res.scene_map[this.chapter][this.section]
    //this.map_list = res.scene_map[this.chapter];
    

    var loading_maps = g_var.scene_map[this.chapter].slice(this.section);
    var start_m = 0
    cc.log(loading_maps)
    for (var i = 0; i < loading_maps.length; i++) {
      var tileMap =  new cc.TMXTiledMap(res.map);
      //same map cannot be add twice
      this.addChild(tileMap, 1);
      this.load_object(tileMap);
      //set x pos
      tileMap.x = start_m
      start_m = start_m + tileMap.width; 
      this.map_list.push(tileMap);
    };
    
    cc.log(this.map_list)
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
      return true
    }
    this.map_index --;
    return false
  },
  roll:function(dleft, dright){
    var pos = this.getPosition();
    if(dright > 0){
      cc.log('dright >0')
      pos.x = pos.x - dright;
    }
    //dleft不判断 不允许地图回滚
    
    if(-pos.x > this.current_map.width && dright > 0){
      cc.log('swidth map next')
      if(!this.switch_next()){
        cc.log('the end of the map')
        return false
      };
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
    //player 在主屏的位置
    //this.x是已经卷动的距离 为负数
    var dright = g_var['MAP_ROLLING_SPACE'] - (swidth - ppos.x) + this.x
    var dleft = g_var['MAP_ROLLING_SPACE'] - (ppos.x - this.x)
    return [dleft,dright]
  },
  display_left:function(){

  },
  display_right:function(){

  },
  update:function(dt, ppos){
    //地图滚动
    var d = this.calc_roll(ppos, this.swidth);
    //map 移动后 player的位置要减少
    this.roll(d[0], d[1]);
  
  }
});






