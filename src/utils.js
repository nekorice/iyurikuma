//jquery extends

var Rect = function(){

}

Rect.prototype = {
  constructor:Rect,
  cross:function(r2){
    var r1 = this;
    return true;
  },
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
    }
  }
})();
  