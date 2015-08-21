//一个同步的callback链，就是为了好读一点
var CallChain = function(){
  //pedding/resolved/reject/
  this.state = "pending";
  this.thenable = true;
  return this;
}

CallChain.prototype = {
  constructor:CallChain,
  then:function(func) {
    if(this.state == 'resolved'){
      var ret = func();
      if(ret.thenable) {
        return ret
      }
    }
    return this;
  },
  error:function(func) {
    if(this.state == 'reject'){
      func();
    }
    return this;    
  },
  resolve:function() {
    this.state = 'resolved';
  },
  reject:function() {
    this.state = 'reject';
  },
}