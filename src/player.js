/*
    File:   player.js
    Author: necorice
    Date:   2014/7/28
    license: MIT
*/
var ANIMATION_SCALE = 0.6

var Player = cc.Sprite.extend({
  //ui
  score:0,
  hp:3,
  //动画列表
  act:{},
  //当前动画 class Armature
  animate:null,
  animate_action:null,
  speed:250,
  //包围盒定义
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

    //包含一个移动器，一个碰撞器，一个状态机（动画作为回调），一个动画管理器

    //state
    this.fsm = new PlayerFsm(this);
    //this.idle();
    
    //未完成    
    this.collide = new NomalCollide();
    

    this.setPosition(p);
    cc.log(this.getPosition());

    this.handle = new ClassicMove(p, this.speed);

    //存储上一帧的位置 用于计算当前位移，来同步滚动地图
    this.last_position = p;

    //bullet
    this.bullet = null;
    this.bullet_time = 0;
    this.bullet_config = {};

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
  handle_cooldown: function(dt){
    if(this.bullet_time){
      this.bullet_time += dt;
    } 
  },
  emitBullet: function(dt){
    var tp = 'basic';
    var forword = this.animate_forword == 1

    //多种 bullet 有不同的 cooldown
    //get bullet cooldown
    //this.cooldown = 
    //当前的 bullet tp
    //计算 cooldown 的时间也有问题,现在是每次按键才会计算 所以这里应该不用加 dt
    //专门的计算cooldown dt 和触发的 emitBullet

    this.bullet_time += dt;
    if(!this.bullet || this.bullet_time > this.bullet.cooldown){
      this.bullet_time = 0;
      var ret = g_var.bulletpoll_p.get_bullet(tp, this.getPosition(), forword);
      this.bullet = ret[0]
      cc.log(ret[1])
      if(!ret[1]){
        this.parent.addChild(this.bullet);
      } 
      //emit 有时候调用时机不对
      this.bullet.emit();      
    }

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
    
    if(cc.KEY.c in this.keyHasPress){
      this.emitBullet(dt);
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
          if(!this.keyHasPress[cc.KEY.left]){
            this.fsm.transform('idle');
          }
          break;
        case cc.KEY.left:
          if(!this.keyHasPress[cc.KEY.right]){
            this.fsm.transform('idle');
          }
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
    return ground
  },
  doCollide: function(rect){
    return this.collide.check(this.collide_rect(), rect);
  },
  boom: function(node, ui_layer){
    //从逻辑层更新 ui_layer的代码使用事件来传播
    //不使用这种传播 this 的方式
    //emitter

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
    }else if(node.type == 'bullet'){
      this.hp --;
      //event
    }
  },
  update:function(dt){

    //key的响应只改变运动参数（速度，加速度，方向）
    //更新在update中通过其他函数处理完成
    this.handleKey(dt);

    this.handle_cooldown(dt);

    //切换状态的cd时间 在状态机中定义
    this.fsm.do_state(dt);

    //this.parent == maplayer
    //get 地面高度
    //不能使用current map  此函数应该放到map里面  为了实现回到旧的地图  
    var ground_hight = this.collide_ground(this.parent.current_map);
    
    var left = -this.parent.x + this.boxWidth;
    var right = -this.parent.x + this.parent.swidth;
    //防止超过两端
    //dt 地板高度  最左坐标 最右坐标
    var pos = this.handle.move(dt, ground_hight, left, right);
    //cc.log(pos);
    this.setPosition(pos);
    //update position
    this.last_position = pos; 

    return pos 
    //return {x:dx, y:dy} 
  }
})






