/*
    File: fsm.js
    Author: necorice
    Date:   2015/8/13
    license: MIT
*/

//定义动作时间
var player_states = {
  'idle':{
    'action_time':0,
  },
  'stop':{
    'action_time':0,
  },
  'move':{
    'action_time':1.25,
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

player_fsm = function(host){
  this.host = host;
  this.last_action = 'idle';
  this.last_action_time = 0;
  this.last_action_pass = 0;
  this.state = '';
  return this;
}

player_fsm.prototype.wait_action_over = function(dt) {
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
player_fsm.prototype.transform = function(dt, state){

  if(this.state == state){
    //不转换
    //cc.log('not transform')
    this.last_action_pass = 0;
    //临时代码
    if(this.host[state]){
       this.host[state]()
    }
    return false
  }

  //check state 返回>0，则不需要wait上一个动作完成
  //返回<0，则禁止转换
  //返回0 则wait_action_over
  var r = this['check_'+state](dt)
  if(r < 0){
    return false; 
  }else if(r == 0  && !this.wait_action_over(dt)){
    return false;
  }

  this.state = state;
  this.last_action = state;
  this.last_action_pass = 0;
  this.last_action_time = player_states[state]['action_time'];
  //对于attach这种有子类型的如何处理
  //所有attach是一个状态，但是不同attach有不同
  //添加一个attack_type?

  //之后使用then方法 弄一个类似的jquery deferred的东东
  if(this.host[state]){
    this.host[state]()
  }
  return true
}


player_fsm.prototype.check_idle  = function(dt){
  return 0
}

player_fsm.prototype.check_move  = function(dt){
  //只有idle时，不用wait 
  return 0
}

player_fsm.prototype.check_attack  = function(dt){
  //
  return 0
}

player_fsm.prototype.check_hit  = function(dt){
  //can be trams from any
  return 0
}


//jump fsm for --> move



/*

thenObject -->differed

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













