var politics = avalon.define({
    $id: "politics",
    id: xs_utils.getQueryParam("id"),
    parent_id: '',
    conList: [],
    articleList: [],
    carouselList: [], //焦点图
    showCarousel: false, //显示焦点图
    isLoading: false,
    loadingFlash: false,
    loading_id: "parent_id_1",
    next_page_url: "",
    syToken: xs_utils.getLocalStorage("syToken"),
    swiper: null,
    init: function() {
        politics.getParentIdList();
        politics.getArticleList("1");
    },
    //父级列表
    getParentIdList: function() {
        var url = xs_utils.getApiUrl("/api/article/parent-list", {
            //"parent_id":politics.parent_id
            "token":politics.syToken
        });

        $.get(url, function(ret) {
            //console.log(ret);
            if (ret.status_code == "200") {
                politics.conList = ret.data;
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
    //焦点图
    getArticleCarousel: function(parent_id) {
        politics.showCarousel = false;
        politics.carouselList = [];
        var url = xs_utils.getApiUrl("/api/article/carousel", {
            "parent_id": parent_id,
            "token":politics.syToken
        });

        $.get(url, function(ret) {
            //console.log(ret);
            if (parent_id > 1) {
                politics.swiper.destroy(true, true);
            }
            if (ret.data.length > 0) {
                politics.carouselList = ret.data;
                politics.showCarousel = true;

                politics.swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    autoplay: 2000, //可选选项，自动滑动
                    autoplayDisableOnInteraction: false,
                    loop: true
                });


            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                politics.showCarousel = false;
            }
        });
    },
    //文章列表
    getArticleList: function(parent_id) {
        politics.getArticleCarousel(parent_id);
        document.body.scrollTop = "0";
        politics.isLoading = false;
        politics.loadingFlash = true;

        politics.parent_id = parent_id;
        politics.articleList = [];
        politics.next_page_url = '';

        var url = xs_utils.getApiUrl("/api/article/article-list", {
            "parent_id": parent_id,
            "token":politics.syToken
        });

        $.get(url, function(ret) {
            // console.log(ret);
            if (ret.data) {
                politics.articleList = ret.data;
                politics.loadingFlash = false;

                //准备加载更多
                if (ret.meta.pagination.links.next) {
                    politics.next_page_url = ret.meta.pagination.links.next;
                    $(window).scroll(function(event) {
                        //console.log("滚动"+politics.next_page_url);
                        if (xs_utils.checkDocumentIsScrollToBottom()) {
                            // console.log("到底了");
                            if (!politics.isLoading) {
                                // console.log("准备加载")
                                politics.loadingFlash = true;
                                politics.loadMoreList();
                                politics.isLoading = true;
                            } else {
                                // console.log("加载中");
                            }
                        } else {
                            politics.isLoading = false;
                        }
                    });

                }

            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                politics.loadingFlash = false;
            }
        });
    },
    loadMoreList: function() {
        //加载更多
        if (!politics.next_page_url) {
            politics.loadingFlash = false;
            politics.isLoading = false;
            //console.log("没有更多了");
        } else {
            var url = politics.next_page_url + "&token="+politics.syToken+"&parent_id=" + politics.parent_id
            $.get(url, function(ret) {
                politics.next_page_url = ret.meta.pagination.links.next;
                politics.articleList = politics.articleList.concat(ret.data);
                politics.loadingFlash = false;
                politics.isLoading = false;
            });
        }
    },


});

$(function() {
    politics.init();
});
