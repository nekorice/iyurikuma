/*
    File:   enemy.js
    Author: necorice
    Date:   2016/3/13
    license: MIT
*/

var Enemy = cc.Sprite.extend({
  //class variable
  //cocos 这里是浅复制
  //任何对象数组会导致在不同的 class 中共享内容
  hp:3,
  //当前动画 class Armature
  animate:null,
  animate_action:null,
  //make enemy slow than player
  speed:200,
  awakeDis:150,
  //包围盒定义  读配置
  boxWidth:34,
  boxHeight:90,
  //动画的朝向
  animate_forword:1,
  type:'enemy',
  disable:false,
  ctor:function (tileObject, offset) {
    this._super();
    this.init(cc.p(tileObject['x']+offset, tileObject['y']));
  },
  init:function(p){

    cc.log("init enemy:" + p['x'], p['y'])
    
    this.setAnchorPoint(0, 0);
    this.keyHasPress = {};
    //动画列表
    this.act = {};

    //init 动画
    this.initAnimation();

    //包含一个移动器，一个碰撞器，一个状态机，一个动画管理器

    this.fsm = new EnemyFsm(this);

    this.collide = new NomalCollide();
    
    this.setPosition(p);
    cc.log(this.getPosition())
    //cc.log(this.getPosition());

    this.handle = new StaticMove(p, this.speed);
    //this.bullet = SimpleBullet
    this.fsm.transform('idle');

    this.attackAnimateTime = 0.5;
    this.patrolTime = 3;
    //deep copy
    this.originPos = {x:p.x,y:p.y};
    //todo  back origin pos
    this.isOriginPos = true;
    //
    this.patrolLength = 100;  
    this.visible = false;

    this.test = 0;
  },
  initAnimation:function(){
    //初始化骨骼动画
    //manager 管理 预加载
    //动画需要统一管理

    //这里是单独的初始化
    //return ccs.ArmatureAnimation
    var armature = new ccs.Armature("kumarun");
    //see action
    armature.scale = ANIMATION_SCALE;
    armature.setLocalZOrder(999);
  
    this.act.run = armature;
    armature.visible = false;
    this.addChild(armature); 
  },
  change_animation:function(act, action) {
    //相同动画不重新播放，只是处理转头
    if(this.animate == act && this.animate_action == action) {
      //change animation  
      this.animate.scaleX = this.animate_forword * ANIMATION_SCALE;
      return 
    }

    if(this.animate){
      this.animate.getAnimation().stop();
      this.animate.visible = false;
    }
    //change animation  
    act.scaleX = this.animate_forword * ANIMATION_SCALE;
    this.animate = act;
    this.animate.visible = true;
    this.animate_action = action;
    this.animate.getAnimation().play(action);
    //cc.log(this.animate);    
  },
  //idle patrol hunting attack back
  //attack_time
  //checkAwake checkAttackAble 
  idle:function() {
    this.handle.stopmove();
    this.change_animation(this.act.run, 'stop');    
  },
  patrol:function(){
    //call back when state move
    this.change_animation(this.act.run, 'run');
    this.handle.patrol(this.originPos.x - this.patrolLength, this.originPos.x + this.patrolLength);
    this.animate_forword = this.handle.isForword ? 1 : -1
  },
  hunting:function(){
    if(this.handle.speed == 0){
      this.change_animation(this.act.run, 'stop');
    }else{
      this.change_animation(this.act.run, 'run');
    }
    this.targetPos = this.parent.playerPos();
    this.handle.hunting(this.targetPos.x);
    this.animate_forword = this.handle.isForword ? 1 : -1
    
  },
  toFar:function(){
    return false;
  },
  attack:function(){
    this.change_animation(this.act.run, 'stop');
    this.handle.stopmove();
    console.log('Im attacking');
    //bullet
  },
  back:function(){
    //todo
    this.handle.back(this.originPos.x);
  },
  checkAwake:function(){
    //当隐藏时 不判断
    //if(this.isHiden){return false}

    var pos = this.parent.playerPos();
    //当 player 靠近一定程度 
    //只有水平目光
    //视野限制
    if(pos.x > this.x - this.awakeDis && pos.x < this.x + this.awakeDis && 
pos.y > this.y - 100 && pos.y < this.y + 100 ){
      console.log('awakinnnnnnng')
      return true
    }
    return false
  },
  checkAttackAble:function(){
    //check cooldown
    //atack range
    //use bullet
    this.test++;
    if(this.test % 120 == 0){
      return true
    }
    return false   
  },
  collide_rect:function(){
    //包围盒
    return new Rect(this.x-this.boxWidth/2, this.y, this.boxWidth, this.boxHeight);
  },
  calc_visible: function(x) {
    if(this.disable || x > this.x + g_var.ACTIVE_WIDTH || x < this.x - g_var.ACTIVE_WIDTH){
      return false
    }
    return true
  },
  draw_collide:function(dnode){
    //动点要自己更新自己的 layer
    //dnode.clear();
    drawRect(this.collide_rect(), dnode);
  },
  collide_tiles:function(last_map, current_map){
    //地图卷动  last_map <--> current_map 缝隙
    //从 tile map 里面找到当前 position 的 tiels 碰撞坐标
    //get tiles
    //-->map对象-->battlelayer
    //this.parent = map

    var mpos = this.parent.get_map_pos(this.getPosition())
    var map = mpos.offset === true ? last_map : current_map;

    var tpos = TilesHelper.getTilesPos(map, mpos.pos);
    //get到
    var ground = TilesHelper.getGround(map, tpos);

    //jump可以往上，但是不能往下


    //掉入深坑的左右碰撞未制作 获得当前 tiles 向左最近和向右最近的 wall
    var wall = TilesHelper.getWall(map, tpos);
    //debugger;
    return [ground, wall]
  },
  collide_item:function(){
    //地形
    //y 轴的 collid
    //x 轴的 collied  left right
    //获得ActiveObject  tp 为 可以 collide 的物品
    //计算 y轴的rect
    //计算当前 x 轴的碰撞
    var an = this.parent.getActiceObject();
    var left = 0;
    var right = 9999;
    var bottom = 0;

    for (var i = an.length - 1; i >= 0; i--) {
      //cc.log(_activeNode.type)
      //移动的物体需要 update
      var node = an[i]      
      
      if(node.type.indexOf('door') != -1 && (this.y - node.y <= -node.height ) && node.nouse){
        if(node.x >= this.x - g_var.PIXMIN  && node.x < right){
          right = node.x;
        }
        if(node.x <= this.x + g_var.PIXMIN && node.x > left){
          left = node.x;
        }

      }

      if(node.type.indexOf('bridge') != -1 && (this.x - node.x - this.boxWidth/2 <= node.width)){
        if(node.y <= this.y + g_var.PIXMIN && node.y > bottom){
          bottom = node.y;
        }
      }

    };    



    return {left:left, right:right, bottom:bottom}
  },  
  doCollide: function(rect){
    return this.collide.check(this.collide_rect(), rect);
  },
  boom: function(node){
    //碰撞处理  事件发送 

  },
  update:function(dt){
    //切换状态的cd时间 在状态机中定义
    
    //this.fsm.calcAI();
    //this.fsm.do_state(dt);
    //test
    this.idle();
    
    //** <<-----------------------------从 player 中继承
    var item_collide = this.collide_item();
    //this.parent == maplayer
    //get 地面高度
    var tiles_collide = this.collide_tiles(this.parent.last_map, this.parent.current_map);
    var ground_hight = tiles_collide[0]
    //collide_y
    ground_hight = Math.max(ground_hight, item_collide.bottom);
  
    //防止超过两端  屏幕绝对坐标 变化的是 this.parent.x 的坐标
    //原本地形的 collid 没有计算
    //var wall = this.collide_wall(this.parent.current_map);
    var left = -this.parent.x + this.boxWidth;
    var right = -this.parent.x + this.parent.swidth;

    //计算前方 x 坐标范围内的物品的 x 碰撞
    //collide_x 
    left = Math.max(item_collide.left, left, tiles_collide[1].left);
    right = Math.min(item_collide.right, right, tiles_collide[1].right);
    //** <<-----------------------------从 player 中继承


    //dt 地板高度  最左坐标 最右坐标
    var pos = this.handle.move(dt, ground_hight);
    //var pos = this.getPosition()
    //cc.log(pos);
    //check is back to oripos
    this.isOriginPos = pos.x - this.originPos.x < g_var.PIXMIN
    this.setPosition(pos);
    return pos 
  }
})






