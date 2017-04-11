var ucenter = avalon.define({
    $id: "ucenter",
    mybridge:null,
    loadingFlash: true,
    showInfo: false,
    syToken: xs_utils.getLocalStorage("syToken"),
    u_name: '',
    u_avatar: '',
    insuranceInfo: false, //保险
    init: function() {
        //判断本地是否存有头像和名字
        //console.log(ucenter.syToken);
        var name = xs_utils.getLocalStorage("sy_u_name");
        var avatar = xs_utils.getLocalStorage("sy_u_avatar");
        if (!name || !avatar) {
            ucenter.getUserInfo();
        } else {
            ucenter.u_name = name;
            ucenter.u_avatar = avatar;
            ucenter.showInfo = true;
            ucenter.loadingFlash = false;
        }
        //保险信息
        ucenter.getInsuranceInfo();
    },
    //修改头像
    modifyUserAvatar: function() {
        var url = xs_utils.getApiUrl("/api/user/update-avatar", {
            "avatar": ucenter.u_avatar,
            "token": ucenter.syToken
        });
        console.log(ucenter.u_avatar);
        $.post(url, function(ret) {
            console.log(ret);
            if (ret.status_code == "200") {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                xs_utils.setLocalStorage("sy_u_avatar",ucenter.u_avatar);
                console.log(ucenter.u_avatar);
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
    getUserInfo: function() {
        var url = xs_utils.getApiUrl("/api/user/search-doctor", {
            "token": ucenter.syToken
        });

        $.get(url, function(ret) {
            console.log(ret);
            if (ret.data) {
                ucenter.u_name = ret.data.name;
                ucenter.u_avatar = ret.data.avatar;
                ucenter.showInfo = true;
                ucenter.loadingFlash = false;
                //将名字和头像存到本地
                xs_utils.setLocalStorage("sy_u_name", ret.data.name);
                xs_utils.setLocalStorage("sy_u_avatar", ret.data.avatar);
            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                ucenter.loadingFlash = false;
            }
        });
    },
    //获取保险单信息
    getInsuranceInfo: function() {
        var url = xs_utils.getApiUrl("/api/user/center", {
            "token": ucenter.syToken
        });

        $.get(url, function(ret) {
            // console.log(ret);
            if (ret.data.doctor_insurances) {
                ucenter.insuranceInfo = ret.data.doctor_insurances;
            } else {
                // layer.open({
                //     content: "暂无保险单信息",
                //     type: 1,
                //     time: 3,
                //     className: 'mylayer',
                //     shade: false
                // });
                ucenter.insuranceInfo = false;
            }
        });
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
    quitLogin:function(){
        ucenter.connectWebViewJavascriptBridge(function (bridge) {
            ucenter.mybridge = bridge;
        });
        var data = 5; //参数为任意值，默认即可
        var u = navigator.userAgent; //用于判断手机类型
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        
        if (!isiOS) {
            //非IOS手机调用的原生退出方法
            console.log("And退出");
           xs_utils.clearLocalStorage();
           Quit.Quit();
        } else {
            //IOS手机调用的原生退出方法
            console.log("IOS退出");
            xs_utils.clearLocalStorage();
            ucenter.mybridge.callHandler('QuitLogin', data, function(response) {});
        }
    },
    //获取当前时间作为上传图片一部分
    getImgTime:function() {
        var now = new Date();
        var YYYY = now.getFullYear();
        var MM = now.getMonth() + 1;
        var DD = now.getDate();
        var HH = now.getHours();
        var II = now.getMinutes();
        var SS = now.getSeconds();

        if (MM < 10) {
            MM = "0" + MM;
        }
        if (DD < 10) {
            DD = "0" + DD;
        }
        if (HH < 10) {
            HH = "0" + HH;
        }
        if (II < 10) {
            II = "0" + II;
        }
        if (SS < 10) {
            SS = "0" + SS;
        }

        console.log(YYYY + "-" + MM + "-" + DD + "-" + HH + "-" + II + "-" + SS);
        return YYYY + MM + DD + HH + II + SS;
    },
    
});
$(function() {
    ucenter.init();
});
