var feedback = avalon.define({
    $id:"feedback",
    showTips:true,
    tit:'',
    txt:'',
    count:0,
    syToken:xs_utils.getLocalStorage("syToken"),
    textareaOnFocus:function(){
        feedback.showTips = false;
    },
    textareaOnBlur:function(){
        feedback.txt = feedback.txt.replace(/\s/g,"");
        if(!feedback.txt){
            feedback.showTips = true;
        }
    },
    textareaKeyup:function(){
       feedback.count = feedback.txt.replace(/\s/g,"").length;
       if(feedback.count>=500){
         feedback.count = 500;
       }
    },
    textareaInput:function(){
       feedback.count = feedback.txt.replace(/\s/g,"").length;
       if(feedback.count>=500){
         feedback.count = 500;
       }
    },
    sendFeedback:function(){
        
        if(!feedback.tit.replace(/\s/g,"")){
            layer.open({
                content: "请输入标题内容",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if(!feedback.txt.replace(/\s/g,"")){
            layer.open({
                content: "请输入正文内容",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        
        var url = xs_utils.getApiUrl("/api/feedback", {
            "title":feedback.tit,
            "content":feedback.txt,
            "token":feedback.syToken
        });
        $(".btn-block").addClass('disabled');
        $(".btn-block").prop("disabled",true);
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
                    location.href='u_center.html';
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

    },
});
