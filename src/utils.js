//jquery extends

var Rect = function(x, y, w, h){
  //left top点
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.center = {'x':x+w/2, 'y':y+h/2}

}

Rect.prototype = {
  constructor:Rect,
  inRect:function(r2){
    var r1 = this;

    var dx = Math.abs(r1.center.x - r2.center.x) - (r1.w + r2.w) / 2  
    var dy = Math.abs(r1.center.y - r2.center.y) - (r1.h + r2.h) / 2
    if(dx < 0 && dy < 0){
      return true;
    }else{
      return false;
    }
  },
}

function drawRect(rect, dnode) {
  if(dnode){
    dnode.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x+rect.w, rect.y+rect.h), null, 2, cc.color(255, 0, 255, 255));
  }
}

//跨frame for
function forperFrame(array, per, target, func){

}

var TilesHelper = (function(){
  
  return {
    'getTilesPos':function(tilemap, pos){
      /*
        tilemap: cc.TMXTiledMap
        pos:     在layer中的坐标
        获得tilemap坐标 0base 
        tilemap的坐标是左上角是0,0
      */

      //换图之后获得当前的tile

      var h = tilemap.tileHeight
      var w = tilemap.tileWidth
      //添加一个计算时间可能导致的响应误差
      pos.y = pos.y + h/10
      
      return { x:Math.floor(pos.x/w), y:tilemap.mapHeight - Math.floor(pos.y/h)  }
    },
    'getGround':function(tilemap, pos){
      /*
        tilemap:cc.TMXTiledMap
        pos: tilemap的tile坐标
      */
      //get 当前高度 最近的一个往下最近的一个地面 加上一点计算误差
      //tilemap的坐标是左上角是0,0
      //默认值是地图下面
      var ground = tilemap.mapHeight;
      var collidableLayer = tilemap.getLayer("collide");
      
      if(pos.x >= tilemap.mapWidth){
        //cc.log(pos.x)
        pos.x = tilemap.mapWidth -1;
      }
      if(pos.x < 0){
        cc.log('oop pos < 0')
        pos.x = 0;
      }

      pos.y = Math.max(pos.y, 0);
      for (var i = pos.y; i < tilemap.mapHeight; i++) {
        var gid = collidableLayer.getTileGIDAt(pos.x, i);
        var proper = tilemap.getPropertiesForGID(gid);
        if(proper != undefined && proper["collide"] == 1) {
          ground = i;
          break;
        }
      };
      //cc.log(pos.y)
      //cc.log(ground)
      return (tilemap.mapHeight - ground) * tilemap.tileHeight;
    },
    'getWall':function(tilemap, pos){
      /*
        tilemap:cc.TMXTiledMap
        pos: tilemap的tile坐标

        offset: 还需要在切换地图的时候提供offset来计算正确的坐标

        mark: 垂直向的 collide_y 和横向的 collide_x 要使用不同的图层属性
              x不能跳跃, y 可以在 wall 里面无视
              这样对于跳跃穿越  横向层 不用判断 是否用跳跃横穿了 wall
      */
      //get 当前高度 最近的一个往下最近的一个地面 加上一点计算误差
      //tilemap的坐标是左上角是0,0
      var left = 0,right = 99999;
      var collidableLayer = tilemap.getLayer("collide");
      /*
      var test = []
      for (var i = 0; i <tilemap.mapWidth; i++) {
        for (var j=0; j<tilemap.mapHeight; j++){
          var gid = collidableLayer.getTileGIDAt(i, j);
          var proper = tilemap.getPropertiesForGID(gid);
          if(proper != undefined && proper["collide"] == 1) {
            test.push([i,j])
          } 
        }
      };*/
      
      //前面获得的 tiles 貌似会多一
      pos.y = pos.y -1;
      if(pos.y >= tilemap.mapHeight){
        //cc.log(pos.x)
        pos.y = tilemap.mapHeight -1;
      }

      if(pos.y < 0){
        cc.log('oop pos < 0')
        pos.y = 0;
      }

      //0 
      //cc.log(pos.x, pos.y)
      for (var i = pos.x; i < tilemap.mapWidth; i++) {
        var gid = collidableLayer.getTileGIDAt(i, pos.y);
        var proper = tilemap.getPropertiesForGID(gid);
        if(proper != undefined && proper["collide"] == 1) {
          right = i * tilemap.tileWidth + tilemap.x;
          break;
        } 
      };
      for(var j = pos.x - 1; j >= 0; j--){
        var gid = collidableLayer.getTileGIDAt(j, pos.y);
        var proper = tilemap.getPropertiesForGID(gid);
        if(proper != undefined && proper["collide"] == 1) {
          left = i * tilemap.tileWidth + tilemap.x;
          break;
        }               
      }  

      return {left:left , right:right }
    },
  }
})();
  