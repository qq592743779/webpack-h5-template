/**
 * @author Azu
 * @description 图片预加载器
 * @example 
 *  var loader = new Loader({
        resources : [
            'a.png','b.png','c.png'
        ],
        onStart : function(total){
        },
        onProgress : function(current, total){
        },
        onComplete : function(total,totalTime){
        }
    });
    loader.start();
 */
(function (root, factory){
    if(typeof define === 'function' && define.amd){
        //  AMD模块
        define(factory)
    }else if(typeof exports === 'object'){
        //  Node, CommenJS模块
        module.exports = factory();
    }else{
        //浏览器全局变量(root 即 window)
        try{
            root.hotcss = factory(root)
        }catch(e){}
    }
}(this, function(){
    //构造器函数
    function Loader(config){
        this.status = 0;    //  加载器的状态（0：未启动，1：正在加载，2：加载完成）
        this.currentIndex = 0;  //  当前加载的索引
        this.total = 0; //  资源总数
        this.timestamp = 0; //  开始记录时间
        this.option = {
            resources: [],  //  加载的资源
            onStart: null,  //  加载开始回调钩子
            onProgress: null,   //  加载进度回调钩子
            onComplete: null    //  加载完成回调钩子
        }
        this._init(config);
    }
    Object.assign(Loader.prototype, {
        //  初始化
        _init: function(config){
            this.timestamp = new Date().getTime();  //  记录开始使时间
            for(var key in config){
                key in this.option && (this.option[key] = config[key]);
            }
            this.total = this.option.resources.length || 0;
        },
        //  开始加载
        start: function(){
            var _this = this;
            //  触发开始钩子函数
            this.isFunc(this.option.onStart) && this.option.onStart(this.total);
            //  加载资源
            this.option.resources.forEach(function(url){
                var image = new Image();
                image.onload = function(){
                    _this.loaded()
                }
                image.onerror = function(){
                    _this.loaded()
                    console.log('加载失败:' + url);
                }
                image.src = url;
            });
            this.status = 1;
        },
        //  加载完成
        loaded: function(){
            //  触发加载进度钩子函数
            this.isFunc(this.option.onProgress) && this.option.onProgress(++this.currentIndex,this.total);
            if(this.currentIndex == this.total){
                var totalTime = new Date().getTime() - this.timestamp;  //  记录开始使时间
                this.isFunc(this.option.onComplete) && this.option.onComplete(this.total, totalTime);
                this.status = 2;
            }
        },
        isFunc: function(fn){
            return typeof fn === 'function';
        }
    })

	window.Loader = Loader; 
    return Loader;
}))
