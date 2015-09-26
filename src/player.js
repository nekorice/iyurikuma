/*
    File:   player.js
    Author: necorice
    Date:   2014/7/28
    license: MIT
*/
var ANIMATION_SCALE = 0.6

var Player = cc.Sprite.extend({
  //动画列表
  act:{},
  //当前动画 class Armature
  animate:null,
  animate_action:null,
  speed:125,
  //包围盒定义
  boxWidth:50,
  boxHeight:50,
  //动画的朝向
  animate_forword:1,
  ctor:function (p) {
    this._super();
    //come from 2.x
    this.init(p);
  },
  init:function(p){

    this.keyHasPress = {}
    //init 动画
    this.initAnimation();

    //包含一个移动器，一个碰撞器，一个状态机（动画作为回调），一个动画管理器

    //state
    this.fsm = new player_fsm(this);
    //this.idle();
    
    //未完成    
    this.collide = new NomalCollide(1);
    
    this.setPosition(p);
    cc.log(this.getPosition());

    this.handle = new ClassicMove(p, this.speed);
    //this.bullet = PlayerBullet

    //存储上一帧的位置 用于计算当前位移，来同步滚动地图
    this.last_position = p;

    //animation 和状态机绑定
    //state 状态机
    // -- state --> animation  action
    //状态 对应的判断，动画 
    //不同状态切换 行为？
    //move  jump  idle attack hit
    //specilaction
  },
  initAnimation:function(){
    //初始化骨骼动画
    //manager 管理 预加载
    armatureDataManager= ccs.armatureDataManager;
    //load json
    //add plist and png in resource.js
    armatureDataManager.addArmatureFileInfo(res.kumarun);
    armatureDataManager.addArmatureFileInfo(res.kumaswing);
    //see name in json
    //return ccs.ArmatureAnimation
    var armature = ccs.Armature.create("kumarun");
    var kumaswing = ccs.Armature.create("kumasw");
    //see action
    //armature.getAnimation().playWithIndex(2);
    //armature.getAnimation().play('run');
    //kumaswing.getAnimation().play('swing');
    
    //armature.stop()
    //armature.pause()
    kumaswing.scale = ANIMATION_SCALE;
    kumaswing.setLocalZOrder(999);

    armature.scale = ANIMATION_SCALE;
    armature.setLocalZOrder(999);
    //反向
    //armature.setScaleX(-0.6);
    //armature.scaleY = 0.6
    
    this.act.run = armature;
    this.act.swing = kumaswing;

    armature.visible = false;
    kumaswing.visible = false;

    this.addChild(armature); 
    this.addChild(kumaswing);
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
  idle:function() {
    //animation
    //this.state = "idle";
    //maybe not stop just pause
    
    //set run = false;
    //maybe use state
    this.handle.stopmove();
    this.change_animation(this.act.run, 'stop');
    //this.change_animation(this.act.swing, 'swing');
    
  },
  move:function(){
    //call back when state move
    this.change_animation(this.act.run, 'run');
  },
  stop:function(){
    this.change_animation(this.act.run, 'stop');
  },
  handleKey:function(dt){
    //持续性的动作在这里处理
    //每一帧的按键处理
    if( cc.KEY.right in this.keyHasPress){
      this.handle.forword();
      this.animate_forword = 1;
    }else if( cc.KEY.left in this.keyHasPress){
      this.handle.backword();
      this.animate_forword = -1;
    }
  },
  pressKey:function(key, press){
    /** 
      press: true-press false-release 
    */

    //记录按键状态和发送状态机指令
    //key up 事件
    //press
    if(press){
      
      this.keyHasPress[key] = true;

      switch(key){
        case cc.KEY.right:
          //add forword speed
          this.fsm.transform('move');
          break;
        case cc.KEY.left:
          //add back speed
          this.fsm.transform('move');
          break;
        case cc.KEY.x:
          //jump
          console.log('jump')
          this.handle.dojump();
          break;
      }

    }else{

      delete this.keyHasPress[key];
      switch(key){
        case cc.KEY.right:
          this.fsm.transform('idle');
          break;
        case cc.KEY.left:
          this.fsm.transform('idle');
          break;
        case cc.KEY.x:
          break;
      }
    }
    
    return this.getPosition();
  },
  on_touch:function(touch){
    //touch to move


  },
  collide_rect:function(){
    //包围盒
    //this.boundbox = new cc.rect(p.x, p.y, this.width, this.height);
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
    return ground
  },
  collide:function(){

  },
  update:function(dt){

    //key的响应只改变运动参数（速度，加速度，方向）
    //更新在update中通过其他函数处理完成
    this.handleKey(dt);

    //切换状态的cd时间 在状态机中定义
    this.fsm.do_state(dt);

    //this.parent == maplayer
    //get 地面高度
    //不能使用current map  此函数应该放到map里面  为了实现回到旧的地图  
    var ground_hight = this.collide_ground(this.parent.current_map);
    
    var left = -this.parent.x + this.boxWidth;
    var right = -this.parent.x+this.parent.swidth;
    //防止超过两端
    //dt 地板高度  最左坐标 最右坐标
    var pos = this.handle.move(dt, ground_hight, left, right);
    //cc.log(pos);
    this.setPosition(pos);
    //update position

    if(g_var.DEBUG){
      //draw boundbox
    }
    
    this.last_position = pos;
    return pos 
    //return {x:dx, y:dy} 
  }
})






