/*
    File: bullet.js
    Author: necorice
    Date:   2015/8/3
    license: MIT
*/


Bullet = cc.Class.extend({

  ctor:function () {
    if(this._super){
      this._super();
    } 

    this.init();
  },
  init:function(){

    // 单发弹

    //this.animate = 
    //子弹只检测是否与地形碰撞和ENERY_MY碰撞
    //碰撞列表为：1，player和友军 2.自己和友军子弹 3.敌军子弹 4 地形（子弹是否需要和地形交互） 5 敌人
    //player的碰撞由player处理
    //this.collide = xx


  },
  boom:function(){
    //cast boom animate
    //cast boom sound
  },
})

BulletBucket = cc.Class.extend({})
