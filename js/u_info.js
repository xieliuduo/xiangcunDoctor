var uinfo = avalon.define({
    $id:"uinfo",
    syToken:xs_utils.getLocalStorage("syToken"),
    userInfo:{},
    loadingFlash:true,
    showInfo:false,
    init:function(){
        uinfo.getUserInfo();
    },
    getUserInfo:function(){
        var url = xs_utils.getApiUrl("/api/user/search-doctor", {
            "token":uinfo.syToken
        });

        $.get(url, function(ret) {
            console.log(ret);
            if (ret.data) {
                uinfo.userInfo = ret.data;
                uinfo.showInfo = true;
                uinfo.loadingFlash = false;
                //将名字
                xs_utils.setLocalStorage("sy_u_name",ret.data.name);
                // xs_utils.setLocalStorage("sy_u_avatar",ret.data.avatar);
            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                uinfo.loadingFlash = false;
            }
        });
    }
    
});
$(function(){
    uinfo.init();
});
