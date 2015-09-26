//var s_tmw_desert_spacing = "res/tmw_desert_spacing.png";
//var s_tmw_desert_spacing_hd = "tmw_desert_spacing-hd.png";
//var s_tmx = "res/colld.tmx";
//多了一个gif有问题

var scene_map = {

  '0':['res/yuri.tmx','res/yuri.tmx'],
}

//use as a namespace
var res = {
    //bone_json:'res/bone/demo.json',
    //d1:'res/bone/DemoPlayer0.plist',
    //d1g:'res/bone/DemoPlayer0.png',
    //d2:'res/bone/DemoPlayer1.plist',
    //d2g:'res/bone/DemoPlayer1.png',

    //image
    background:'res/back.jpg',

    //music
    //bgm:'res/music/TERRITORY.mp3',

    //tilemap
    //map:'res/mario.tmx',
    //tmx_png:'kuma1.png',
    y_map:'res/yuri.tmx',
    tmx_png:'res/ymap.png',
    tmx_png2:'res/xmap.png',
   

    //kumarun
    kumarun:'res/kumarun.json',
    krp:'res/kumarun0.plist',
    krg:'res/kumarun0.png',
    //kumaswing
    kumaswing:'res/kumasw.json',
    kwp:'res/kumasw0.plist',
    kwg:'res/kumasw0.png',
}

var g_var = {
  'player_zorder':2,
  'KEYS' : [],
  //地平线
  'horizon':192,
  //重力
  'gravity':10,
  'PIXMIN':10,
  'DEBUG':true,
  'MAP_ROLLING_SPACE':100,
  'MAP_SKY_SPACE':200,
  'scene_map':scene_map,
}

//这里在preload使用用来提前载入资源
var g_resources = [
    //image
    //s_HelloWorld,
    //s_CloseNormal,
    //s_jet,
    //s_CloseSelected,
    //s_Walk,

    //s_tmw_desert_spacing,
    //{src:s_tmw_desert_spacing_hd}, 

    //plist
    //s_Walk_plist,

    //fnt

    //tmx
    //s_tmx
    //bgm

    //effect

];

for (var i in res) {
    g_resources.push(res[i]);
}

