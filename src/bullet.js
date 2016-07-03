/*
    File: bullet.js
    Author: necorice
    Date:   2015/8/3
    license: MIT
*/

//"use strict";

var Bullet = cc.Sprite.extend({
  flyTag: 301,
  boomTag: 302,
  type: 'basic',
  cooldown: 1.5,
  aliveTime: 3,
  ctor:function (point, reverse_x) {
    if(this._super){
      this._super();
    } 

    this.init(point, reverse_x);
  },
  init:function(point, reverse_x){

    //frame animate helper
    this.walk_prefix = "fire"

    this.initWithSpriteFrameName(this.walk_prefix + "1.png");

    var animFrames = [];
    // set frame
    var frame_step = 14;
    for (var i = 1; i < frame_step; i++) {
      var frame = cc.spriteFrameCache.getSpriteFrame(this.walk_prefix + i +".png");
      animFrames.push(frame); 
    };
    var walkfront = new cc.Animation(animFrames, 0.1);
    this.front_animate = cc.RepeatForever.create(new cc.Animate(walkfront));
    this.front_animate.setTag(this.flyTag);
    this.runAction(this.front_animate);
    cc.log('bullet start')

    //path move
    this.vector = { x:1, y:1 }
    this.speed = { x:35 * this.vector.x, y:0 * this.vector.y }
    this.reverse = 1;
    if(reverse_x){
      this.reverse = -1;
    }

    // 单发弹
    //子弹只检测是否与地形碰撞和ENERY_MY碰撞
    //碰撞列表为：1，player和友军 2.自己和友军子弹 3.敌军子弹 4 地形（子弹是否需要和地形交互） 5 敌人
    //player的碰撞由player处理
    this.collide = new NomalCollide();
    this.isDestory = true;

    //get this.height
    //this.width
    //cc.log(this.height)
    //cc.log(this.width)
    this.setPosition(point.x + this.width/2, point.y + this.height/2);
    this.life = 0;

  },
  emit: function(){
    //自更新 以后由 bulletsystem
    this.scheduleUpdate();
  },
  isOutOfScreen: function(){
    //不作判断 超出屏幕依然有效 用 live 时间来控制
    //当加入到 map 的 child 中就不能这么判断了
    //nouseful
    var pos  = this.getPosition();
    var size = cc.director.getWinSize();
    //bullet pos是屏幕的相对坐标
  },
  reuse: function(point, reverse_x){
    this.setPosition(point.x + this.width/2, point.y + this.height/2)
    this.reverse = 1;
    this.life = 0
    if(reverse_x){
      this.reverse = -1;
    }
    this.visible = true;
  },
  doCollide: function(rect){
    //碰撞统一由场景管理
    return this.collide.check(this.collide_rect(), rect);
  },
  boom:function(){
    //cast boom animate
    //cast boom sound
    this.destory(false);
  },
  destory: function(de){
    //destory
    this.unscheduleUpdate();
    this.visible = false;
    this.isDestory = true;
    cc.log('the bullet is destory')

  },
  update:function(dt){
    //update pos
    this.x = this.x + this.speed.x;
    this.y = this.y + this.speed.y;

    //check is it alive
    this.life += dt;
    if(this.life > this.aliveTime){
      this.destory(false);
    }
  },
})

/*
all the bullets are rendered by one spritesheet,
*/

//重复利用的 bullet pool
var BulletPool = cc.Class.extend({
  max:100,
  ctor:function() {
    if(this._super){
      this._super();
    } 
    this.init();
  },
  init:function(){
    //this.will be load only one
    cc.spriteFrameCache.addSpriteFrames(res.s_Walk_plist, res.s_Walk);
    this.bullet_poll = {}
  },
  get_bullet:function(tp, pos, reverse_x){
    //get tp bullet
    if(!this.bullet_poll[tp]){
      this.bullet_poll[tp] = []
    }   
    var poll = this.bullet_poll[tp];
    for (var i = poll.length - 1; i >= 0; i--) {
      if(poll[i].isDestory){
        poll[i].reuse(pos, reverse_x);
        return [poll[i],true]
      }
    };

    //not find object  use BulletFactory
    var bullet = new Bullet(pos, reverse_x);
    this.bullet_poll[tp].push(bullet);
    return [bullet,false]
  },
  get_active_bullet:function(){
    var ret = [];
    for(var k in this.bullet_poll){
      if(this.bullet_poll.hasOwnProperty(k) && !this.bullet_poll[k].isDestory){
        ret.concat(this.bullet_poll[k]);
      }
    }
    return ret
  },
  recycle:function(){
    //when stage change 
    //do recycle
  },
})

//整个弹幕的维护
var BulletSystem = cc.Class.extend({})



