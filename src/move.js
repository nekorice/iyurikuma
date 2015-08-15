/*
    File: move.js
    Author: necorice
    Date:   2015/7/29
    license: MIT
*/

ClassicMove = cc.Class.extend({
  pos:null,
  max_speed:null,
  x_op:0,
  y_op:0,
  per_speed:30,
  jump_speed:150,
  ctor:function (pos, sp) {
    if(this._super){
      this._super(pos, sp);
    } 
    //come from 2.x
    this.init(pos, sp);
  },
  init:function(pos, speed){
    //assert(pos);
    //assert(speed);

    this.pos = pos;
    this.max_speed = speed;
    this.jump = false;
    this.speed = 0;
    this.speed_y = 0;
    this.gravity = g_var.gravity
    this.run = false;
  },
  forword:function(dt){
    if(this.speed < 0){ 
      //转头 0太慢
      this.speed = this.per_speed
    }

    if(this.speed < this.max_speed ){
      this.speed += this.per_speed;
    }

    this.run = true;
    return this.pos
  },
  backword:function(dt){
    if(this.speed > 0 ){  this.speed = -this.per_speed  }

    if(this.speed > -this.max_speed){
      this.speed -= this.per_speed;
    }    
    this.run = true;
    return this.pos
  },
  move:function(dt, ground, max_left, max_right){
    this.pos.x = this.pos.x + this.speed * dt
    this.pos.y = this.pos.y + this.speed_y * dt
    
    //不能超出屏幕
    if(this.pos.x < 0){
      this.pos.x = 0;
    }

    //need collide
    //有grond的不会小于地表高度
    //没有地表，则把 ground 赋值负数 表示掉到地图下面去了
    //还有多重ground的情况 这里的ground 应当指当前可以看到的ground
    if(this.pos.y > ground){ 
      this.pos.y = this.pos.y - this.gravity * dt;
    }else{
      //hit on ther ground  踩到地板了
      this.pos.y = ground;
      this.speed_y = 0;
      this.jump = 0;
    }
    
    
    if(this.speed > -1 && this.speed < 1){
      //误差
      this.speed = 0
    }

    if(this.speed != 0 && !this.run){
      //60fps  结束时的帧速
      //模拟摩擦力
      //15接近冰块
      this.speed = this.speed - (this.speed / 2)
    }
    
    //设定下落速度极限 为jump值
    if(this.speed_y > -this.jump_speed){
      this.speed_y = this.speed_y - this.gravity
    }else{
      this.speed_y = -this.jump_speed
    }
    
    if(this.pos.x < max_left){
      this.pos.x = max_left;
    }
    if(this.pos.x > max_right){
      this.pos.x = max_right;
    }

    return this.pos
  },
  stopmove:function(dt){
    this.run = false;
  },
  dojump:function(dt){
    if(this.jump <= 1){
      //do jump
      this.speed_y = 400;
      //二段跳得设置
      this.jump += 1;
    }
    return this.pos
  }
});

TestMove = ClassicMove.extend({});

