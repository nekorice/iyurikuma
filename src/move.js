/*
    File: move.js
    Author: necorice
    Date:   2015/7/29
    license: MIT
*/

/**
  move 用来处理最后的移动
       包括控制 x 向量和 y 向量,弹跳等
       反向是用负数表示
       move 中没有使用变量来判断前进后退

  其他函数都是用来改变状态和速度的向量,来传递当前状态

*/

ClassicMove = cc.Class.extend({
  pos:null,
  maxSpeed:null,
  x_op:0,
  y_op:0,
  per_speed:7,
  jump_speed:650,
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
    this.maxSpeed = speed;
    this.jump = false;
    this.speed = 0;
    this.speed_y = 0;
    this.gravity = g_var.gravity
    this.run = false;
    //二级跳
    this.jumpLimit = 2;
  },
  forword:function(dt){
    if(this.speed < 0){ 
      //转头 0太慢
      this.speed = this.per_speed
    }

    if(this.speed < this.maxSpeed ){
      this.speed += this.per_speed;
    }

    this.run = true;
    return this.pos
  },
  backword:function(dt){
    if(this.speed > 0 ){  this.speed = -this.per_speed  }

    if(this.speed > -this.maxSpeed){
      this.speed -= this.per_speed;
    }    
    this.run = true;
    return this.pos
  },
  move:function(dt, ground, max_left, max_right){
    /*
      dt:      每帧时间
      ground: 地板高度
      max_left: 最左坐标
      max_right: 最右坐标
    */
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
      //交给speedy计算，不再多次计算重力
      //this.pos.y = this.pos.y - this.gravity * dt;
    }else{
      //hit on ther ground  踩到地板了
      //触发land状态
      this.pos.y = ground;
      this.speed_y = 0;
      this.jump = 0;
    }
    
    
    if(this.speed > -1 && this.speed < 1){
      //误差
      this.speed = 0
    }

    //****  现在这样设定，速度的增加和减少会和帧率相关 *****
    //需要改进 speed的减少也需要和dt相关 减小的加速度是常数
    if(this.speed != 0 && !this.run){
      //60fps  结束时的帧速
      //模拟摩擦力
      //15接近冰块
      this.speed = this.speed - (this.speed / 2)
    }
    

    //设定下落速度极限 为jump值
    if(this.speed_y > -this.jump_speed){
      this.speed_y = this.speed_y - this.gravity * 60 * dt
    }else{
      this.speed_y = -this.jump_speed
    }
    
    if(max_left !== undefined && this.pos.x < max_left){
      this.pos.x = max_left;
    }
    if(max_right !== undefined && this.pos.x > max_right){
      this.pos.x = max_right;
    }

    return this.pos
  },
  stopmove:function(dt){
    this.run = false;
  },
  dojump:function(dt){
    //触发jump状态
    if(this.jump < this.jumpLimit){
      //do jump
      this.speed_y = this.jump_speed;
      //二段跳得设置
      this.jump += 1;
    }
    return this.pos
  }
});

TestMove = ClassicMove.extend({});

StaticMove = ClassicMove.extend({
  init:function(pos, speed){
    //assert(pos);
    //assert(speed);

    this.pos = pos;
    this.maxSpeed = speed;
    this.per_speed = 25;
    this.speed = 0;
    this.jump = false;
    this.speed_y = 0;
    this.gravity = g_var.gravity
    this.run = false;
    this.jumpLimit = 1;
    this.isForword = true;
  },
  forword:function(rate){
    if(this.speed < this.maxSpeed ){
      this.speed += this.per_speed;
    }
    this.speed = this.speed * rate
    this.run = true;
    this.isForword = true; 
    return this.pos
  },
  backword:function(rate){
    if(this.speed > -this.maxSpeed){
      this.speed -= this.per_speed;
    } 
    this.speed = this.speed * rate
    this.run = true;
    this.isForword = false;
    return this.pos
  },
  stopmove:function(dt){
    this.speed = 0
    this.run = false;
    return this.pos;  
  },
  patrol: function(startX, endX) {
       
    if(this.isForword){
      if(this.pos.x >= endX){
        this.backword(0.7);
        return
      }else{
        this.forword(0.7);
        return 
      }      
    }else{
      if(this.pos.x <= startX){
        this.forword(0.7);
        return
      }else{
        this.backword(0.7);
      }
    }
  },
  hunting: function(targetX) {
    //10 = 追击缓冲
    var stopDis = 10
    if(this.pos.x >= targetX + stopDis){
      this.backword(1);
    }else if (this.pos.x <= targetX - stopDis){
      this.forword(1);
    }else{
      this.stopmove();
    }
  },
  move: function(dt, ground){
    //call super
    //不限制最左和最右
    return this._super(dt, ground, undefined, undefined);
  }

})


PathMove = StaticMove.extend({
  //物体 按照一条路径移动
  //给定一个函数队列
  //输入当前x,y, 符合条件 a,  输出当前的速度方向vector
  //不断的执行
  init:function(pos, speed, path){
    this._super(pos, speed);
    this.path = path;
    this.origin = pos;
    this.doPath(path);
  },
  doPath: function(p){
    
    //patrol
    this.op = this.patrol;
    var startX = this.origin.x;
    var endX = this.origin.x + 200;
    this.pathArgs = [startX, endX];
  },
  move: function(dt){
    
    this.op.apply(this, this.pathArgs);
    this.pos.x = this.pos.x + this.speed * dt
    this.pos.y = this.pos.y + this.speed_y * dt

    return this.pos;
  },
});

PathMoveFactory = function(pos, speed, tp) {
  var path_dict = {}

  return new PathMove(pos, speed, 'patrol')

}

