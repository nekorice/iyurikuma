/*
    File: action.js
    Author: necorice
    Date:   2015/7/28
    license: MIT
*/


NomalCollide = cc.Class.extend({
  rect:null,
  ctor:function (s) {
    if(this._super){
      this._super(s);
    } 
    //come from 2.x
    this.init(s);
  },
  init:function(s){
    this.rect = s;
  },   
  collide:function(rect){
    /*if(their rect in myrect){
      return true;
    }  
    else{
      return false;
    }*/
  },
  collide_rect:function(center){
    return rect;
  }

})


EmptyCollide = NomalCollide.extend({
  collide:function(params){
    return false;
  },
  collide_rect:function(center){
    return null;
  }

})


//单元测试方法
//Jusmine

