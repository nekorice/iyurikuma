//var s_tmw_desert_spacing = "res/tmw_desert_spacing.png";
//var s_tmw_desert_spacing_hd = "tmw_desert_spacing-hd.png";
//var s_tmx = "res/colld.tmx";
//多了一个gif有问题

var scene_map = {
  //scene  chapter
  '0':['res/yuri.tmx','res/yuri.tmx'],
}

//use as a namespace
var res = {
    //bone_json:'res/bone/demo.json',
    //d1:'res/bone/DemoPlayer0.plist',
    //d1g:'res/bone/DemoPlayer0.png',
    //d2:'res/bone/DemoPlayer1.plist',
    //d2g:'res/bone/DemoPlayer1.png',

    //animate frame
    s_Walk: "res/tmagic.png",
    s_Walk_plist: "res/tmagic.plist",

    //image
    loading_png:'res/loading.png',
    background:'res/background.png',

    //music
    //bgm:'res/music/TERRITORY.mp3',

    //texture
    bridge:'res/ui/bridge.png',
    flower:'res/ui/yuri.png',
    trap:'res/ui/trap.png',
    door:'res/ui/door.png',
    key:'res/ui/key.png',

    //tilemap
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

    //battle ui
    battle_ui:'res/ui/battle_ui.json',

}

var g_var = {
  //
  'ACTIVE_WIDTH': 900,
  'DSWIDTH': 960,
  'DSHEIGHT': 640,
  //
  'player_zorder': 2,
  'KEYS' : [],
  //地平线
  'horizon': 192,
  //重力
  'gravity': 20,
  'PIXMIN': 5,
  'DEBUG': true,
  'MAP_ROLLING_SPACE': 300,
  'MAP_SKY_SPACE': 200,
  'scene_map': scene_map,
}

//这里在preload使用用来提前载入资源
var g_resources = [
  'res/ui/font.fnt',
  'res/ui/font.png',
  'res/ui/pow.png',
  'res/ui/add_box.png',
];

for (var i in res) {
    g_resources.push(res[i]);
}

