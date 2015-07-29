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
  move:function(dt, ground){
    this.pos.x = this.pos.x + this.speed * dt
    //need collide
    
    if(this.pos.y > ground + g_var.PIXMIN ||  this.pos.y < ground - g_var.PIXMIN){
      this.pos.y = this.pos.y - this.gravity * dt
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
    return this.pos
  },
  stopmove:function(dt){
    this.run = false;
  },
  jump:function(dt){
    if(!this.jump){
      //do jump
    }
    return this.pos
  }
});

TestMove = ClassicMove.extend({});