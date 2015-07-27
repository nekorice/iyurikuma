/*
    Author: necorice
    Date:   2014/7/29
    Name:   Cocos2d-js v3.0 final
    license: MIT
*/
var Player = cc.Sprite.extend({
  ctor:function (s) {
    this._super(s);
    //come from 2.x
    this.init();
  },
  init:function(){
    //init 动画
    //idle 动画  和 move动画

    //add a action
    //添加一个行为
    //移动 不一定会碰撞
    //切换行为 改变表现

    //this.collide = NomalCollide
    //this.move = ClassicMove
    //this.bullet = PlayerBullet
    

    //state 状态机
    //状态 对应的判断，动画 
    //不同状态切换 行为？

    //抽象
    


  },
  handleKey:function(key){
    //key to  move


  },
  on_touch:function(touch){
    //touch to move


  },
  collide_rect:function(){

  },
  collide:function(){

  },
  update:function(dt){
    //sprite 必备的特性

  }，
  check:function(magic){
    if(magic.tp == this.won_tp){
        return 1;
      }else if(magic.tp == this.tp){
        return 0
      }
      return -1;
  },
})