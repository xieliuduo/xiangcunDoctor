var login = avalon.define({
    $id:"login",
    phone:'',
    password:'',
    goLogin:function(){
        if(!login.phone){
            layer.open({
                content: "请输入手机号",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if(!login.password){
            layer.open({
                content: "请输入密码",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        
        var url = xs_utils.getApiUrl("/api/auth/login", {
            "phone":login.phone,
            "password":login.password
        });

        $.post(url, function(ret) {
            if (ret.status_code=="200") {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                setTimeout(function(){
                    location.href='index.html?token='+ret.data;
                },3000);
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
