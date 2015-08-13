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
  'move':{
    'action_time':1.5,
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
}

player_fsm.prototype.wait_action_over = function(dt){
  //if(state == 'idle'){
  //  return true;
  //}

  this.last_action_pass += dt; 
  if(this.last_action_pass >= this.last_action_time ){
     return true;
  }
  return false;
}

//transform
player_fsm.prototype.transform = function(dt, state){

  if(this.state == state){
    //不转换
    return false
  }

  //check state 返回>0，则不需要wait上一个动作完成
  //返回<0，则禁止转换
  //返回0 则wait_action_over
  var r = this['check_'+state](dt)
  if(r < 0){
    return false; 
  }else if(r = 0  && !this.wait_action_over()){
    return false;
  }

  this.state = state;
  this.last_action = state;
  this.last_action_pass = 0;
  this.last_action_time = player_states['state']['action_time'];
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

/*

thenObject -->differed


fsm --> host  return host.xxx()


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













