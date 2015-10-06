var splitEffect = function (spr, forever, callback){
    spr.opacity = 0;
    //ccui的类没有绑定opacity方法。。。结果
    spr.setOpacity(0);
    var delay = cc.DelayTime.create(0.25);
    var fade = cc.FadeIn.create(1.0);
    var actionBack = fade.reverse();
    //var action2 = cc.FadeOut.create(1.0);
    if(callback == null){
       cc.log('is null');
       callback = function(){}; 
    }
        
    var func = cc.callFunc(callback, spr);
    var seq = cc.Sequence.create(fade, delay, actionBack, func)
    if(forever == true){
      seq = seq.repeatForever();   
    }
    cc.log('pre run');
    spr.runAction(seq);
    cc.log('run after');
}

var delayLoad = function (spr, delay, callback){
    var delay = cc.DelayTime.create(delay);
    var seq = cc.Sequence.create(delay, cc.callFunc(callback, spr));
    spr.runAction(seq);
}


var fadeInEffect = function (spr) {

}

var fadeEffect = function (spr, dua, callback){
    //fade and set visible = false
    //spr.opacity = 0;
    var delay = cc.DelayTime.create(0.25);
    var fade = cc.FadeOut.create(dua);
    //var action2 = cc.FadeOut.create(1.0);
    var func = null;
    if(callback == null){
        func = cc.callFunc(function(){
           spr.visible = false;
           cc.log('callback')
        }, spr);
    }else{
        func = cc.callFunc(callback, spr);
    }

    var seq = cc.Sequence.create(fade, delay, func)
    spr.runAction(seq);
}


var scaleRotateEffect = function (spr, dua, reverse, callback){
    var rotate = cc.RotateBy.create(dua, 360)
    var scale = cc.ScaleTo.create(dua, 4);
    if(reverse == true){
        scale = cc.ScaleTo.create(dua, 1/4);
        rotate = rotate.reverse();
    }     
    var spw = cc.Spawn.create(rotate, scale);

    var func = null;
    if(callback == null){
        func = cc.callFunc(function(){
            //cc.log('default callback')
            spr.visible = false;
        }, spr);
    }else{
        func = cc.callFunc(callback, spr);
    }

    var seq = cc.Sequence.create(spw, func);
    spr.runAction(seq);
}


var BoomEffect = function(spr, dua){
    //make boom effect
    var action =  cc.ShuffleTiles.create(dua, cc.size(16,12), 25);
    var fade  = cc.FadeOut.create(dua);
    var spw = cc.Spawn.create(action, fade);
    
    var callback = cc.callFunc(function(spr){
       spr.removeFromParent();        
    }, spr);
    
    var delay = cc.DelayTime.create(0.5);
    var back = action.reverse();
    var seq = cc.Sequence.create(spw, delay, back, callback);
    spr.runAction(seq);
}


var scaleBoomEffect = function (spr, dua, callback){
    var scale = cc.ScaleTo.create(dua, 3);
    var boom_func = cc.callFunc(function(spr){
            //spr.visible = false;
            //draw boom
            //隐藏之后 boom动画 boom音效
            spr.boom(false);
            cc.log('boom!');        
    }, spr);

    var func = null;
    if(callback == null){
        func = cc.callFunc(function(){
        }, spr);
    }else{
        func = cc.callFunc(callback, spr);
    }


    var seq = cc.Sequence.create(scale, boom_func, func);
    spr.runAction(seq);
}

var shake3D = function(spr, dua){
    var shake = cc.Shaky3D.create( dua/2, cc.size(15,10), 5, false );
    var seq = cc.Sequence.create(shake,shake.reverse(),cc.StopGrid())
    //dident' come back
    spr.runAction(seq);
}

var shake2D = function(spr, dua){
    var size = 5
    var seq = cc.Sequence.create(
        cc.MoveBy.create(0.05, cc.p(size, 0)),
        cc.MoveBy.create(0.05, cc.p(0, -size)),
        cc.MoveBy.create(0.05, cc.p(0, size)),
        cc.MoveBy.create(0.05, cc.p(-size, 0))
    );

    spr.runAction(seq.repeat(Math.ceil(dua/0.4)));
}

var flareEffect = function (flare,target, callback) {
    flare.stopAllActions();
    flare.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    flare.attr({
        x: -30,
        y: 297,
        visible: true,
        opacity: 0,
        rotation: -120,
        scale: 0.2
    });

    var opacityAnim = cc.fadeTo(0.5, 255);
    var opacDim = cc.fadeTo(1, 0);
    var biggerEase = cc.scaleBy(0.7, 1.2, 1.2).easing(cc.easeSineOut());
    var easeMove = cc.moveBy(0.5, cc.p(328, 0)).easing(cc.easeSineOut());
    var rotateEase = cc.rotateBy(2.5, 90).easing(cc.easeExponentialOut());
    var bigger = cc.scaleTo(0.5, 1);

    var onComplete = cc.callFunc(callback, target);
    var killflare = cc.callFunc(function () {
        this.parent.removeChild(this,true);
    }, flare);
    flare.runAction(cc.sequence(opacityAnim, biggerEase, opacDim, killflare, onComplete));
    flare.runAction(easeMove);
    flare.runAction(rotateEase);
    flare.runAction(bigger);
};