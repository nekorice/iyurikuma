/*
    File: action.js
    Author: necorice
    Date:   2015/7/28
    license: MIT
*/


NomalCollide = cc.Class.extend({
  rect:null,
  ctor:function () {
    if(this._super){
      this._super();
    } 
    //come from 2.x
    this.init();
  },
  init:function(){
    //
  },   
  check:function(r1, r2){
    if(r1.inRect(r2)){
      return true;
    }  
    else{
      return false;
    }
  }
})


EmptyCollide = NomalCollide.extend({
  check:function(r1, r2){
    return false;
  }
})


//单元测试方法
//Jusmine

