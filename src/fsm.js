/*
    File: fsm.js
    Author: necorice
    Date:   2015/8/13
    license: MIT
*/



//稍微有点混乱 需要整理
PlayerFsm = Class.extend({
  init: function(host){
    this.host = host;
    this.last_action = 'idle';
    this.last_action_time = 0;
    this.last_action_pass = 0;
    this.state = 'idle';
    return this;
  }
});

PlayerFsm.prototype.wait_action_over = function(dt) {
  //if(state == 'idle'){
  //  return true;
  //}
  this.last_action_pass += dt; 
  if(this.last_action_pass >= this.last_action_time){
    cc.log('change');
    return true;
  }
  //cc.log('not change');
  return false;
}

//transform
PlayerFsm.prototype.transform = function(state){

  if(this.state == state){
    //不转换
    //cc.log('not transform')
    //this.last_action_pass = 0;
    //临时代码
    //if(this.host[state]){
    //   this.host[state]()
    //}
    return false
  }

  this.last_action = this.state;
  this.last_action_pass = 0;
  var state_time = this.getStateTime()
  this.last_action_time = state_time[this.state]['action_time'];
  this.state = state;

  //对于attach这种有子类型的如何处理
  //所有attach是一个状态，但是不同attach有不同
  //添加一个attack_type? 由do state或者回调处理
  return true
}

PlayerFsm.prototype.do_state = function(dt) {

  if(!this.state){
    return false;
  }

  if(this.last_action != this.state){
    //check state 返回>0，则不需要wait上一个动作完成
    //返回<0，则禁止转换
    //返回0 则wait_action_over
    var r = this['check_'+this.state](dt)
    if(r < 0){
      return false; 
    }else if(r == 0  && !this.wait_action_over(dt)){
      return false;
    }    
  }

  //调用宿主的对应 state 名称的方法
  if(this.host[this.state]){
    this.host[this.state]()
  }else{
    throw "fsm.js:the State:[{0}] method is not Define in Class {1}".format(this.state, this.host.constructor.name)
  }
  this.last_action = this.state;
  return true;  
}

PlayerFsm.prototype.getStateTime = function(){
  //定义动作时间
  var player_states = {
    'idle':{
      'action_time':0,
    },
    'stop':{
      'action_time':0,
    },
    'move':{
      //至少0.75 否则会出现转身的错误
      'action_time':0.75,
    },
    'hit':{
      'action_time':1,
    },
    /*
    'attack':{
      'normal':{
        'action_time':1,
      },
      'super':{
        'action_time':5,
      }
    }*/
  } 
  return player_states
}


PlayerFsm.prototype.check_idle  = function(dt){
  return 0
}

PlayerFsm.prototype.check_move  = function(dt){
  //只有idle时，不用wait 
  return 0
}

PlayerFsm.prototype.check_attack  = function(dt){
  //
  return 0
}

PlayerFsm.prototype.check_hit  = function(dt){
  //can be trams from any
  return 0
}


//jump fsm for --> move



/*

thenObject -->deferred

fsm --> host  

hit 《----》 canbe hit in player
维护一个无敌的状态

move idle attach hit --》 state--animation

jump land --》 other state


jump --> move对象的状态
move/idle/hit --> player 状态


can_jump
jump
jump_time
land


不用通用，直接特例

check_idle  bool
last_action
action_time --> attack
                hit方式不固定
attack_time-->
hit_time-->


//transform
idle
attack
move

can_hit
hit
*/

//简单的 ai
EnemyFsm = PlayerFsm.extend({
  init:function(host){
    this._super(host);
    //check host method
    //idle patrol hunting attack back
    //attack_time
    //checkAwake checkAttackAble 
    //isOriginPos
  },
  //貌似这个放在 enemy class 里面更合适
  calcAI:function(){
    var self = this;
    switch(this.state){

      case "idle":
        if(self.host.checkAwake()){
          self.transform("hunting");
        }else if(self.last_action_pass > 0.5){
          self.transform("patrol");
        } 
        break;
      
      case "patrol":
        if(self.host.checkAwake()){
          self.transform("hunting");
        }else if(self.last_action_pass > 5){
          self.transform("idle");
        }
        break;
      
      case "hunting":
        if(self.host.checkAttackAble()){
          self.transform("attack");
        }else if(self.host.toFar()){
          self.transform("back");          
        }
        break;

      case "attack":
        self.transform("hunting");
        break;
      
      case "back":
        if(self.host.isOriginPos === true){
          self.transform("idle");
        }
        break;      
    }
  },
  getStateTime:function(){
    var self = this;
    //定义动画时间
    var player_states = {
      'idle':{
        'action_time':0.5,
      },
      'patrol':{
        'action_time':1,
      },
      'hunting':{
        'action_time':1,
      },
      'attack':{
        //as the attack animate 或者直接
        'action_time':this.host.attackAnimateTime || 0.5,
      },
      'back':{
        'action_time':1,
      },
    } 
    return player_states    
  },

})









