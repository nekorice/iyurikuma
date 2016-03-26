/*
    File: bullet.js
    Author: necorice
    Date:   2015/8/3
    license: MIT
*/


Bullet = cc.Sprite.extend({

  ctor:function () {
    if(this._super){
      this._super();
    } 

    this.init();
  },
  init:function(){
    //frame animate
    //path move

    this.vector = { x:1, y:1 }
    this.speed = { x:350 * this.vector.x, y:0 * this.vector.y }

    // 单发弹

    //子弹只检测是否与地形碰撞和ENERY_MY碰撞
    //碰撞列表为：1，player和友军 2.自己和友军子弹 3.敌军子弹 4 地形（子弹是否需要和地形交互） 5 敌人
    //player的碰撞由player处理
    this.collide = new NomalCollide();

  },
  doCollide: function(rect){
    //碰撞统一由场景管理
    return this.collide.check(this.collide_rect(), rect);
  },
  destroy: function(){
    //cast boom animate
    //cast boom sound
  },
  update:function(dt){
    //update pos
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;
    //this.frame_animate.update(dt)

  },
})

BulletBucket = cc.Class.extend({})

BulletSystem = cc.Class.extend({})



