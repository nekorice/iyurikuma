/*
    File:   player.js
    Author: necorice
    Date:   2014/7/28
    license: MIT
*/
var Player = cc.Sprite.extend({
  act:{},
  animate:null,
  speed:125,
  last_dt:0,
  dt:0,
  boxWidth:50,
  boxHeight:50,
  ctor:function (p) {
    this._super();
    //come from 2.x
    this.init(p);
  },
  init:function(p){
    //init 动画
    this.initAnimation();
    //idle 动画  和 move动画

    //add a action
    //添加一个行为
    //移动 碰撞
    //切换行为 改变表现

    //包含一个移动器，一个碰撞器，一个状态机（动画作为回调,当前对象）

    //state
    this.fsm = new player_fsm(this);
    //this.idle();
        
    this.collide = new NomalCollide(1);
    
    this.setPosition(p);
    cc.log(this.getPosition());

    this.handle = new ClassicMove(p, this.speed);
    //this.bullet = PlayerBullet

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
    //animation
    //this.state = "idle";
    //maybe not stop just pause
    
    //set run = false;
    //maybe use state
    this.handle.stopmove();

    if(this.animate){
      this.animate.getAnimation().stop();
      this.animate.visible = false;
    }  
    this.animate = this.act.swing;
    this.animate.visible = true;
    this.animate.getAnimation().play('swing');
  },
  move:function(){
    //animation
    //this.state = "move";
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

    //修改到状态机中
    //if(this.state != 'move'){
    //  this.move();
    //}

    this.fsm.transform(0, 'move');  
    
    if(key == cc.KEY.right){
      this.handle.forword();
    }else if(key == cc.KEY.left ){
      //回头不能够超过屏幕
      this.handle.backword();
    }else if(key == cc.KEY.x){
      console.log('jump')
      this.handle.dojump();
    }else{
      
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
    var tpos = TilesHelper.getTilesPos(tiles, this.getPosition());
    //get到
    var ground = TilesHelper.getGround(tiles, tpos);

    //jump可以往上，但是不能往下

    return ground
  },
  collide:function(){

  },
  update:function(dt){
    //give to handlekey
    
    //切换状态的cd时间 
    //在状态机中定义

    /*
    if(this.state != 'idle'){
      this.last_dt += dt;
      if(this.last_dt > 1.25){
        this.idle();
        this.handle.stopmove();
        this.last_dt = 0;
      }   
    }else{

    }*/

    this.fsm.transform(dt, 'idle');
    //this.handleKey();

    //跑酷 不一定需要移动
    
    //get 地面高度
    var ground_hight = this.collide_ground();
    
    var left = -this.parent.x + 20
    //防止超过两端
    //dt 地板高度  最左坐标 最右坐标
    var pos = this.handle.move(dt, ground_hight, left, (-this.parent.x+this.parent.swidth));

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






