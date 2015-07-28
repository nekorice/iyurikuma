/*
    File: move.js
    Author: necorice
    Date:   2015/7/29
    license: MIT
*/

ClassicMove = cc.Class.extend({
  pos:null,
  speed:null,
  x_op:0,
  y_op:0,
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
    this.speed = speed;
    this.jump = false;
  },
  forword:function(dt){
    this.x_op = 1;
    return this.pos
  },
  backword:function(dt){
    this.x_op = -1;  
    return this.pos
  },
  move:function(dt){
    this.pos.x = this.pos.x + this.speed * dt * this.x_op
    this.pos.y = this.pos.y + this.speed * dt * this.y_op 
    this.x_op = 0;
    this.y_op = 0;
    return this.pos
  },
  jump:function(dt){
    if(!this.jump){
      //do jump
    }
    return this.pos
  }
});

TestMove = ClassicMove.extend({});