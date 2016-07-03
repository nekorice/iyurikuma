/*
    File: animateManager.js
    Author: necorice
    Date:   2016/7/4
    license: MIT
*/

var AnimateManager = cc.Class.extend({
  ctor:function() {
    if(this._super){
      this._super();
    } 
    this.init();
  },
  init:function(){

    armatureDataManager = ccs.armatureDataManager;
    //加载动画文件
    armatureDataManager.addArmatureFileInfo(res.kumarun);
    armatureDataManager.addArmatureFileInfo(res.kumaswing);

  },

})





