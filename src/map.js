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
  chapter_end:false,
  ctor:function (swidth) {
    this._super();
    this.init(swidth);
  },
  init:function(win){
    this.swidth = win.width;
    this.sheight = win.height;
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
      var tileMap =  new cc.TMXTiledMap(loading_maps[i]);
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
  get_map_pos:function(ipos){
    //地图边界时，当前地图的坐标和相对于mapLayer的坐标会不一样
    //cc.log(this.current_map.x);
    
    var bx = ipos.x - this.current_map.x;
    if(bx < 0){
      //还在上一幅图
      bx = ipos.x
    }
    return cc.p(bx, ipos.y)
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
  roll:function(dleft, dright, dtop, dbottom){

    var pos = this.getPosition();
    if(dright > 0){
      cc.log('dright >0')
      pos.x = pos.x - dright;
    }

    if(dtop > 0){
      pos.y = pos.y - dtop; 
    }

    if(dbottom > 0 && pos.y < 0){
      pos.y = pos.y + dbottom;
    }
    
    //不可以往下看啊
    if(pos.y > 0){ pos.y = 0 }
    
    //dleft不判断 暂不允许地图回滚

    //当前窗口+滚动宽度大于地图宽度，进入下一个地图
    if((this.swidth -pos.x) > (this.current_map.width + this.current_map.x) && dright > 0){
      cc.log('swith map next')
      if(this.chapter_end || !this.switch_next()){
        cc.log('the end of the map')
        this.chapter_end = true;
        return false
      };
    }

    this.setPosition(pos);
  },
  roll_middle:function(dx, dy){
    //人物固定中间的地图滚动
    //直接同步人物移动
    //可以使用this.map.runAction(cc.follow(this.player));
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
    //this.x this.y是已经卷动的距离 为负数
    var dright = g_var['MAP_ROLLING_SPACE'] - (swidth - ppos.x) + this.x
    var dleft = g_var['MAP_ROLLING_SPACE'] - (ppos.x - this.x)
    var top =  g_var['MAP_SKY_SPACE'] - (this.sheight - this.y - ppos.y); 
    //var bottom = g_var['horizon'] - (ppos.y + this.y) 
    var bottom = (this.sheight - ppos.y - this.y) - g_var['MAP_SKY_SPACE']

    return [dleft,dright, top, bottom]
  },
  display_left:function(){

  },
  display_right:function(){

  },
  update:function(dt, ppos){
    //地图滚动
    var d = this.calc_roll(ppos, this.swidth);
    //map移动  left right  top  bottom
    this.roll(d[0], d[1], d[2], d[3]);
  
  }
});






