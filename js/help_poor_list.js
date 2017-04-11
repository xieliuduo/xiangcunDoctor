avalon.filters.GetOnePic = function(str) {
    console.log(str.split(",")[0]);
    return str.split(",")[0];
}

var help_poor_list = avalon.define({
    $id:"help_poor_list",
    noData:false,
    list:[],
    next_page_url:'',
    isLoading:false,//滚动到底部是否加载中
    loadingFlash:true,//加载动画
    syToken:xs_utils.getLocalStorage("syToken"),

    getHelpPoorList:function(){
        var url = xs_utils.getApiUrl("/api/poverty-relief/list", {
            "token":help_poor_list.syToken
        });
        $.get(url, function(ret) {
            console.log(ret);
            if (ret.data.length>0) {
                help_poor_list.list = ret.data;
                help_poor_list.loadingFlash = false;

                //准备加载更多
                if (ret.meta.pagination.links.next) {
                    help_poor_list.next_page_url = ret.meta.pagination.links.next;
                    
                }
                $(window).scroll(function(event) {
                    if (xs_utils.checkDocumentIsScrollToBottom()) {
                        
                        if (!help_poor_list.isLoading) {
                            help_poor_list.loadingFlash = true;
                            help_poor_list.loadMoreList();
                            help_poor_list.isLoading = true;
                        }
                    }
                });


            } else {
                // layer.open({
                //     content: ret.message,
                //     type: 1,
                //     time: 3,
                //     className: 'mylayer',
                //     shade: false
                // });
                help_poor_list.noData = true;
                help_poor_list.loadingFlash = false;
                help_poor_list.list = [];
            }
        });

    },
    loadMoreList: function() {
        //加载更多消息 
        if (!help_poor_list.next_page_url) {
            help_poor_list.loadingFlash = false;
            help_poor_list.isLoading = false;
            console.log("没有更多了");
        } else {
            console.log(help_poor_list.next_page_url);
            var url = help_poor_list.next_page_url+"&token="+help_poor_list.syToken
            $.get(url, function(ret) {
                console.log(ret);
                help_poor_list.next_page_url = ret.meta.pagination.links.next;
                help_poor_list.list = help_poor_list.list.concat(ret.data);
                help_poor_list.loadingFlash = false;
                help_poor_list.isLoading = false;
            });
        }
    },
});

$(function(){
    help_poor_list.getHelpPoorList();
});