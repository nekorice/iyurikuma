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
  //collide object  auto add
  loading_object_names:[],
  _lastCheck:{},
  entity:{ 'enemy':[]},
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

    if(g_var.DEBUG){
      this.dnode = new cc.DrawNode();
      this.snode = new cc.DrawNode();
      this.addChild(this.dnode, 999);
      this.addChild(this.snode, 999);
    }

    //背景需要做的超过一屏的分辨率
    //add background image load chapter
    this.back = new cc.Sprite(res.background);
    this.back.setPosition(this.width / 2, this.height / 2);
    this.addChild(this.back);

    //use texture cache
    //var texture = cc.textureCache.addImage(res.flower);
    this.flowerNode = new cc.SpriteBatchNode(res.flower, 30);
    this.trapNode = new cc.SpriteBatchNode(res.trap, 30);
    this.doorNode = new cc.SpriteBatchNode(res.door, 10);
    //以后合并成一个textrue 使用一个batchnode
    this.addChild(this.flowerNode);
    this.addChild(this.trapNode);
    this.addChild(this.doorNode);

    var loading_maps = g_var.scene_map[this.chapter].slice(this.section);
    var start_m = 0
    cc.log(loading_maps)
    for (var i = 0; i < loading_maps.length; i++) {
      var tileMap =  new cc.TMXTiledMap(loading_maps[i]);
      //test one line gap
      this.anti_para(tileMap);
      //same map cannot be add twice
      this.addChild(tileMap, 1);
      this.load_object(tileMap, start_m);
      //set x pos
      tileMap.x = start_m
      start_m = start_m + tileMap.width; 
      this.map_list.push(tileMap);
    };
    
    cc.log(this.map_list);
    this.current_map = this.map_list[0];
    this.last_map = this.map_list[0];
    //this.tileMap = cc.TMXTiledMap.create(res.map);

    
  },
  anti_para:function(map){
    //not effect
    //tilemap 基本都要留两个像素间隔，左右各加多一个像素32+2 保证不出错
    var child = map.getChildren()
    for (var i = child.length - 1; i >= 0; i--) {
      //child[i].getTexture().setAntiAliasTexParameters();
      child[i].getTexture().setAliasTexParameters();
    };
    
  },
  load_object:function(map, start_m){
    //map 上的地块挂接在 map 坐标上
    //start_m 是起始的 offset, 物品都挂接在世界坐标上. start_m 最后会写入 map.x
    //map 也是node 这样滚动map的时候可以直接对应滚动
    //enermy/food 挂载在map上
    //set up enermy
    //this._load_object(map, start_m, 'enemy', Enemy, null);
    //set up flower
    //重新添加一个加载函数
    //head 有两个变量, 这里有一个 load 还有一个 checkvisual
    //管理一下 bnode
    this._load_object(map, start_m, 'yuri', Yuri, this.flowerNode);
    this._load_object(map, start_m, 'trap', Trap, this.trapNode);
    this._load_object(map, start_m, 'door', Door, this.doorNode);
    this._load_object(map, start_m, 'key', Key, null);
    this._load_object(map, start_m, 'bridge', Bridge, null);
    //set up trap

  },
  _load_object: function(map, start_m, group_name, obj, bnode){
    if(!map.getObjectGroup(group_name)){
      cc.log(group_name + 'is not found in map load object')
      return
    }

    if(this.entity[group_name] === undefined){
      this.entity[group_name] = [];
      this._lastCheck[group_name] = 0;
      this.loading_object_names.push(group_name);
    }

    var obs = map.getObjectGroup(group_name).getObjects();
    //objectNamed
    for (var i = obs.length - 1; i >= 0; i--) {
      var fo = new obj(obs[i], start_m);
      fo.draw_collide(this.snode)
      if(bnode!=null){
        bnode.addChild(fo);
      }else{
        this.addChild(fo);
      }
      this.entity[group_name].push(fo);
    };
  },
  load_next:function(){
    //动态加载后面的图
    //一次loading完，不做这么复杂的方式
  },
  get_map_pos:function(ipos){
    //地图边界时，当前地图的坐标和相对于mapLayer的坐标会不一样
    //cc.log(this.current_map.x);
    
    var bx = ipos.x - this.current_map.x;
    var offset = false;
    if(bx < 0){
      //还在上一幅图
      bx = ipos.x
      offset = true;
    }

    return { 'pos':cc.p(bx, ipos.y), 'offset':offset }
  },
  switch_next:function(){
    //
    this.map_index ++;
    if(this.map_index < this.map_list.length){
      this.last_map = this.current_map;
      this.current_map = this.map_list[this.map_index];
      return true
    }
    this.map_index --;
    return false
  },
  roll:function(dleft, dright, dtop, dbottom){
    
    this._rollh(dleft, dright);
    this._rollv(dtop, dbottom);
    
  },
  _rollh:function(dleft, dright){

    if(dright > 0 && this.chapter_end ){
      //快速返回
      return false;
    }

    if(dright > 0){
      cc.log('dright >0')
      this.x = this.x - dright;
    }

    //当前窗口+滚动宽度大于地图宽度，进入下一个地图
    if((this.swidth - this.x) > (this.current_map.width + this.current_map.x) && dright > 0){
      cc.log('swith map next')
      if(this.chapter_end || !this.switch_next()){
        cc.log('the end of the map')
        this.chapter_end = true;
        return false
      };
    }
    //dleft不判断 暂不允许地图回滚
    //移动background
    if(dright > 0){
      this.back.x = this.back.x + dright;
    }
    if(dleft > 0){
      //this.back.x = this.back.x - dleft;
    }
  },
  _rollv:function(dtop, dbottom){
    if(dtop > 0){
      this.y = this.y - dtop; 
    }

    if(dbottom > 0 && this.y < 0){
      this.y = this.y + dbottom;
    }
    
    //不可以往下看啊
    if(this.y > 0){ this.y = 0 }
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
  display_left:function() {

  },
  display_right:function() {

  },
  checkVisual:function() {
    //检查是否可见，在可见范围内的node都加入到app.js里的activeObject
    //进行碰撞判断
    for (var i = this.loading_object_names.length - 1; i >= 0; i--) {
      this._check_visual(this.loading_object_names[i]);
    };
    /*
    this._check_visual('enemy');
    this._check_visual('yuri');
    this._check_visual('trap');
    this._check_visual('door');
    this._check_visual('key');*/
  },
  _check_visual:function(key) {
    //every frame check 10
    var everyFrame  = 10;
    var j = 0;
    var entity = this.entity[key]
    
    //分帧检查数组
    for (var i = this._lastCheck[key]; (i < entity.length && j <= everyFrame); i++) {
      var yu = entity[i]
      if(yu.calc_visible(this.player.x) && !yu.nouse){
        this.parent.activeObject(yu);
      }else{
        this.parent.unactiveObject(yu);
      }
      j++;
    };

    this._lastCheck[key] = i;
    //全部检查完了 从头开始
    if(this._lastCheck[key] >= entity.length){
      this._lastCheck[key] = 0;
    }
  },
  playerPos:function(){
    return this.player.getPosition()
  },
  getActiceObject:function(){
    return this.parent._activeNode;
  },
  update:function(dt, ppos){
    //地图滚动
    var d = this.calc_roll(ppos, this.swidth);
    //map移动  left right  top  bottom
    this.roll(d[0], d[1], d[2], d[3]);
    //check map item visual add to app.js collide array
    this.checkVisual();

    if(g_var.DEBUG){
      this.dnode.clear();
      this.player.draw_collide(this.dnode);
      for (var i = this.entity['enemy'].length - 1; i >= 0; i--) {
        this.entity['enemy'][i].draw_collide(this.dnode);
      };

    }

  }
});






