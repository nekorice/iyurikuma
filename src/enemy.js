/*
    File:   enemy.js
    Author: necorice
    Date:   2016/3/13
    license: MIT
*/

var Enemy = cc.Sprite.extend({
  hp:3,
  //动画列表
  act:{},
  //当前动画 class Armature
  animate:null,
  animate_action:null,
  speed:250,
  //包围盒定义  读配置
  boxWidth:34,
  boxHeight:90,
  //动画的朝向
  animate_forword:1,
  ctor:function (p) {
    this._super();
    //come from 2.x
    this.init(p);
  },
  init:function(p){
    
    this.setAnchorPoint(0, 0);
    this.keyHasPress = {}
    //init 动画
    this.initAnimation();

    //包含一个移动器，一个碰撞器，一个状态机，一个动画管理器

    this.fsm = new EnemyFsm(this);

    this.collide = new NomalCollide();
    
    this.setPosition(p);
    cc.log(this.getPosition());

    this.handle = new ClassicMove(p, this.speed);
    //this.bullet = SimpleBullet
    this.fsm.transform('idle');

    this.attack_time = 0.5;
    this.originPos = p;
    //todo  back origin pos
    this.isOriginPos = true;

  },
  initAnimation:function(){
    //初始化骨骼动画
    //manager 管理 预加载
    //动画需要统一管理
    armatureDataManager = ccs.armatureDataManager;
    //是否可以复用
    armatureDataManager.addArmatureFileInfo(res.kumarun);


    //这里是单独的初始化
    //return ccs.ArmatureAnimation
    var armature = ccs.Armature.create("kumarun");
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
  },
  hunting:function(){
    this.change_animation(this.act.run, 'run');
    
  },
  attack:function(){
    //this.change_animation(this.act.run, 'attack');
    //bullet
  },
  back:function(){
    //todo
  },
  checkAwake:function(){
    //当 player 靠近一定程度 
    //只有水平目光
    //视野限制
    return false
  }
  checkAttackAble:function(){
    //check cooldown
    //atack range

    return false   
  },
  collide_rect:function(){
    //包围盒
    return new Rect(this.x-this.boxWidth/2, this.y, this.boxWidth, this.boxHeight);
  },
  draw_collide:function(dnode){
    dnode.clear();
    drawRect(this.collide_rect(), dnode);
  },
  collide_ground:function(tiles){
    //get tiles
    //-->map对象-->battlelayer
    //this.parent = map
    var mpos = this.parent.get_map_pos(this.getPosition())
    var tpos = TilesHelper.getTilesPos(tiles, mpos);
    //get到
    var ground = TilesHelper.getGround(tiles, tpos);

    //jump可以往上，但是不能往下
    //to do 下跳
    return ground
  },
  doCollide: function(rect){
    return this.collide.check(this.collide_rect(), rect);
  },
  boom: function(node, ui_layer){
    /*
    if(node.type == 'yuri'){
      //分数增加
      this.score += 100;
      //update ui
      ui_layer.lbscore.setString(this.score);
      //node消灭
      node.destroy();
    }else if(node.type == 'trap'){
      
      this.hp --;
      //update_ui
      ui_layer.showHp(this.hp);
      //短暂无敌 快速闪烁动画+timeout，去掉无敌符号
      
      //check die
      node.destroy();
    }*/
  },
  update:function(dt){
    //切换状态的cd时间 在状态机中定义
    this.fsm.calcAI()
    this.fsm.do_state(dt);

    //不能使用current map  此函数应该放到map里面  为了实现回到旧的地图  
    var ground_hight = this.collide_ground(this.parent.current_map);
    
    //null或者 undefined 表示不限制
    var left = -this.parent.x + this.boxWidth;
    var right = -this.parent.x + this.parent.swidth;
    //防止超过两端
    //dt 地板高度  最左坐标 最右坐标
    var pos = this.handle.move(dt, ground_hight, left, right);
    //cc.log(pos);
    this.setPosition(pos);
    return pos 
  }
})






