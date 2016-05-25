/*
    File: bullet.js
    Author: necorice
    Date:   2015/8/3
    license: MIT
*/


Bullet = cc.Sprite.extend({
  fly_tag:301,
  boom_tag:302,
  type:'basic',
  cooldown: 1.5,
  ctor:function (point, reverse_x) {
    if(this._super){
      this._super();
    } 

    this.init(point);
  },
  init:function(point, reverse_x){

    //frame animate helper
    this.walk_prefix = "fire"
    //this.will be load only one
    cc.spriteFrameCache.addSpriteFrames(res.s_Walk_plist, res.s_Walk);
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
    this.front_animate.setTag(this.animate_tag);
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

    //get this.height
    //this.width
    //cc.log(this.height)
    //cc.log(this.width)
    this.setPosition(point.x + this.width/2, point.y + this.height/2)

  },
  emit: function(){
    //自更新 以后由 bulletsystem
    this.scheduleUpdate();
  },
  isOutOfScreen: function(){
    var pos  = this.getPosition();
    var size = cc.director.getWinSize();
    //bullet pos是屏幕的相对坐标
    if(pos.x < 0 || pos.x > size.x || pos.y < 0 || pos.y > size.y){
      return true
    }
    return false
  },
  doCollide: function(rect){
    //碰撞统一由场景管理
    return this.collide.check(this.collide_rect(), rect);
  },
  destroy: function(de){
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

/*
all the bullets are rendered by one spritesheet,
*/

//重复利用的 bullet pool
BulletPool = cc.Class.extend({})

//整个弹幕的维护
BulletSystem = cc.Class.extend({})



