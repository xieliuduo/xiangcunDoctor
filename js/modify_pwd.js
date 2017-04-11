var pwd = avalon.define({
    $id:"pwd",
    old_pwd:'',
    new_pwd:'',
    sure_pwd:'',
    is_pwd:/^\w+$/i,
    syToken:xs_utils.getLocalStorage("syToken"),
    submitSendPassword:function(){

        if(!pwd.old_pwd){
            layer.open({
                content: "请输入当前密码",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        if(!pwd.new_pwd){
            layer.open({
                content: "请输入新密码",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }else if(pwd.new_pwd.length<6||pwd.new_pwd.length>12){
            layer.open({
                content: "密码位数为6-12位",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        if(!pwd.sure_pwd){
            layer.open({
                content: "请再次输入新密码",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }else if(pwd.sure_pwd.length<6||pwd.sure_pwd.length>12){
            layer.open({
                content: "密码位数为6-12位",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        if(pwd.new_pwd!==pwd.sure_pwd){
            layer.open({
                content: "两次新密码输入不一致",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        if (!pwd.new_pwd.match(pwd.is_pwd)) {
                layer.open({
                    content: "密码只能为字母数字下划线",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;
            }

        if (!pwd.sure_pwd.match(pwd.is_pwd)) {
                layer.open({
                    content: "密码只能为字母数字下划线",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;
            }

        var url = xs_utils.getApiUrl("/api/auth/update-password", {
            "oldPassword":pwd.old_pwd,
            "newPassword":pwd.new_pwd,
            "affirmPassword":pwd.sure_pwd,
            "token":pwd.syToken
        });
        console.log(url);
        $(".btn-block").addClass('disabled');
        $(".btn-block").prop("disabled",true);
        $.post(url, function(ret) {
            console.log(ret);
            if (ret.status_code=="200") {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                setTimeout(function(){
                   location.href='setting.html';
                },3000);
            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                $(".btn-block").removeClass('disabled');
                $(".btn-block").removeAttr('disabled');
            }
        });

    }
    
    
});
