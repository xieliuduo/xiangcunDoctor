var article = avalon.define({
    $id:"article",
    showInfo:false,
    loadingFlash:true,
    id:xs_utils.getQueryParam("id"),
    share:xs_utils.getQueryParam("share"),
    from:xs_utils.getQueryParam("from"),
    syToken: xs_utils.getLocalStorage("syToken"),
    articleInfo:{},
    date:'',
    mybridge:null,
    share_url:window.location.href+"&share=true",
    init:function(){
        article.isShare();
    	article.getArticleInfo();
    },
    getArticleInfo:function(){
        var url = xs_utils.getApiUrl("/api/article/article-content", {
            "article_id":article.id,
            "token":article.syToken
        });

        $.get(url, function(ret) {
            console.log(ret);
            if (ret.data) {
                article.articleInfo = ret.data;
                article.date = ret.data.created_at.date;
               article.loadingFlash = false;
               article.showInfo = true;
            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                article.loadingFlash = false;
            }
        });
    },
    isShare:function(){
        if(article.share=="true"){
            $(".link-l").hide();
        }
    },
    goBack:function(){
        // if(article.from=="index"){
        //     location.href = 'index.html';
        // }
        history.go(-1);
    },
    connectWebViewJavascriptBridge: function(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                callback(WebViewJavascriptBridge)
            }, false);
        }
    },
    //过滤html标签
    removeHtmlTag:function(str) {
            str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str=str.replace(/ /ig,'');//去掉 
            return str;
    },
    //文章分享
    toShare:function(){
        article.connectWebViewJavascriptBridge(function(bridge) { article.mybridge = bridge; });
        //参数文章内容 articleContent 分享链接 articleUrl  分享图片 articleImg
        var a_con = article.removeHtmlTag(article.articleInfo.content);
        var data = {"articleTitle":article.articleInfo.title,"articleContent":a_con,"articleUrl":article.share_url,"articleImg":article.articleInfo.thumbnail}; //参数为任意值，默认即可
        var u = navigator.userAgent; //用于判断手机类型
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        console.log(data);
        
        if (!isiOS) {
            //非IOS手机调用的原生分享方法
           console.log("安卓分享网址:"+article.share_url);
           WebCall.share(article.articleInfo.title,a_con,article.share_url,article.articleInfo.thumbnail);
        } else {
            //IOS手机调用的原生分享方法
            console.log("苹果分享");
            article.mybridge.callHandler('GoShare', data, function(response) {});
        }
    },
    
    
});

$(function(){
	article.init();
});
