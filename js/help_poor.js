var help_poor = avalon.define({
    $id:"help_poor",
    id:xs_utils.getQueryParam("id"),
    con:[],
    con_date:'',
    id_card_front:'',
    id_card_back:'',
    pictures:[],
    syToken:xs_utils.getLocalStorage("syToken"),

    getHelpPoorCon:function(){
        var url = xs_utils.getApiUrl("/api/poverty-relief/search", {
            "id":help_poor.id,
            "token":help_poor.syToken
        });

        $.post(url, function(ret) {
            console.log(ret);
            if (ret.data) {
               help_poor.con = ret.data;
               help_poor.con_date = ret.data.created_at.date;
               help_poor.id_card_front = ret.data.id_card_front;
               help_poor.id_card_back = ret.data.id_card_back;
               help_poor.pictures = ret.data.pictures.split(",");
               console.log(help_poor.pictures);
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
    showBigImg:function(src){
        var src = 'http://siyuanfund.oss-cn-qingdao.aliyuncs.com/' + src;
        $("body").css("overflow","hidden");
        $(".show-big-img img").attr("src",src);
        $(".show-big-img").addClass('show');
        var bodyHeight = $(window).height();
        var imgHeight = $(".show-big-img img").height();
        console.log(bodyHeight+"=="+imgHeight);
        if(imgHeight>=bodyHeight){
            $(".show-big-img > img").css({
                "top":"0",
                "margin-top":"0"
            });
        }else{
            $(".show-big-img > img").css({
                "top":"50%",
                "margin-top":"-25%"
            });
        }
    }
});

$(function(){
    help_poor.getHelpPoorCon();
});