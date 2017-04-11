    var index = avalon.define({
    $id:"index",
    lock:false,
    syToken:null,
    approve:"认证中",
    donateList:[],
    articleList:[],
    init:function(){
        //存储token
        index.saveToken();
        //判断本地认证状态是否已认证
        var u_approve = xs_utils.getLocalStorage("sy_u_approve");
        if(!u_approve||u_approve=="认证中"){
            index.getApproveStatus();
        }else{
            index.approve = u_approve;
        }
        //捐赠者信息
        index.showDonationInformation();
        //文章列表
        index.getArticleList();
    },
    saveToken: function() {
        var pToken = xs_utils.getQueryParam("token");
        if (pToken != null && pToken != "null") {
            index.syToken = pToken;
            xs_utils.setLocalStorage("syToken", pToken);
           // console.log("存储token成功");
        }else{
           index.syToken = xs_utils.getLocalStorage("syToken");
        }
        xs_utils.isTokenOld();//判断token是否已经过期
    },
    //捐赠信息
    showDonationInformation:function(){
        var url = xs_utils.getApiUrl("/api/donate/list", {
            "token":index.syToken
        });

        $.get(url, function(ret) {
            console.log(ret);
            if (ret.data) {
                index.donateList = ret.data;
            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
            }
        });
    },
    //捐赠者滚动方法
    autoScroll:function(obj){
       var h = $(".marquee li").eq(0).height();
       $(obj).find("ul:first").animate({
            marginTop: -h
        }, 500, function() {
            $(this).css({
                marginTop: "0px"
            }).find("li:first").appendTo(this);
        }); 
    },
    //认证状态
    getApproveStatus:function(){
        var url = xs_utils.getApiUrl("/api/user/approve", {
            "token":index.syToken
        });

        $.get(url, function(ret) {
            //console.log(ret);
            index.approve = ret.data.status;
            xs_utils.setLocalStorage("sy_u_approve",ret.data.status);
        });
    },
    //开锁解锁
    toggleBtn:function(){
        if(!index.lock){
            index.lock = true;
        }else{
            index.lock = false;
        }
    },
    //文章列表
    getArticleList:function(){
        var url = xs_utils.getApiUrl("/api/article/article-list", {
            "parent_id":1,
            "token":index.syToken
        });

        $.get(url, function(ret) {
           console.log(ret);
            if (ret.data) {
               index.articleList = ret.data.slice(0,3);
            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
            }
        });
    },
    
});
$(function(){
    index.init();
    setInterval('index.autoScroll("#marquee")', 5000);
});
