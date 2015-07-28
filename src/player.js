/*
    File:   player.js
    Author: necorice
    Date:   2014/7/28
    license: MIT
*/
var Player = cc.Sprite.extend({
  act:{},
  animate:null,
  speed:500,
  last_dt:0,
  dt:0,
  ctor:function (p) {
    this._super();
    //come from 2.x
    this.init(p);
  },
  init:function(p){
    //init 动画
    this.initAnimation();

    this.idle();
    //idle 动画  和 move动画
    //切换动画

    //add a action
    //添加一个行为
    //移动 不一定会碰撞
    //切换行为 改变表现

    this.collide = new NomalCollide(1)
    
    this.setPosition(p);
    cc.log(this.getPosition());

    this.handle = new TestMove(p, this.speed)
    //this.bullet = PlayerBullet
    

    //state 状态机
    // -- state --> animation  action
    //状态 对应的判断，动画 
    //不同状态切换 行为？
    //move  jump  idle attack hit
    //specilaction

    //抽象
    


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
    var kumaswing = ccs.Armature.create("swing");
    //see action
    //armature.getAnimation().playWithIndex(2);
    
    //armature.getAnimation().play('run');
    //kumaswing.getAnimation().play('swing');
    
    //armature.stop()
    //armature.pause()
    

    kumaswing.scale = 0.6;
    kumaswing.setLocalZOrder(999);

    armature.scale = 0.6;
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
  idle:function(){
    this.state = "idle";
    //maybe not stop just pause
    if(this.animate){
      this.animate.getAnimation().stop();
      this.animate.visible = false;
    }  
    this.animate = this.act.swing;
    this.animate.visible = true;
    this.animate.getAnimation().play('swing');
  },
  move:function(){
    this.state = "move";
    if(this.animate){
      this.animate.getAnimation().stop();
      this.animate.visible = false;
    } 
    this.animate = this.act.run
    this.animate.visible = true;
    this.animate.getAnimation().play('run');
  },
  handleKey:function(key){
    //key to  move 
    this.last_dt = 0   

    // move in the function move中
    if(this.state != 'move'){
      this.move();
    }  
    
    if(key == cc.KEY.right){
      this.handle.forword();
    }else if(key == cc.KEY.left ){
      this.handle.backword();
    }else{
      
    }

  },
  on_touch:function(touch){
    //touch to move


  },
  collide_rect:function(){

  },
  collide:function(){

  },
  update:function(dt){
    //give to handlekey
    
    //切换状态的cd时间 
    //在状态机中定义
    if(this.state != 'idle'){
      this.last_dt += dt;
      if(this.last_dt > 1.5){
        this.idle();
        this.last_dt = 0;
      }   
    }else{

    }
    
    //this.handleKey();

    //move时间 才能平滑
    //惯性处理  加速度 减速度
    //跑酷 不一定需要移动
    var pos = this.handle.move(dt);
    //cc.log(pos);
    this.setPosition(pos);
    //update position

  }
})





