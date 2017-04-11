//creat by xieliuduo 
var my_patient = avalon.define({   
    $id: "my_patient", 
    uToken: xs_utils.getLocalStorage("syToken"),
    hasPatient: true,//控制无人div显示
    searchText: "",//搜索文本
    patients: [], //患者列表
    noMore:false,//控制没有更多li显示 
    isLoading: false,//控制屏幕滚动事件
    searchisLoading:false,
    loadingFlash: true,//加载动画
    next_page_url: '',//加载更多的接口
   
    init: function() {
       
        my_patient.getMyPatientsList();

    },
    getMyPatientsList: function() {

        my_patient.isLoading = false;
        var url = xs_utils.getApiUrl("/api/patient/list", {
            "token": my_patient.uToken,
        });

        $.get(url, function(ret) {
            var len = ret.data.length;
            if (len >= 1) {
                console.log(ret);
                    
                my_patient.patients = ret.data;
                my_patient.loadingFlash = false;
                console.log(my_patient.patients);

                if (ret.meta.pagination.links.next) {
                    my_patient.next_page_url = ret.meta.pagination.links.next + '&token=' + my_patient.uToken;
                    // console.log(my_patient.next_page_url);
                    $(window).scroll(function(event) {
                        if (xs_utils.checkDocumentIsScrollToBottom()) {
                            if (my_patient.isLoading) {
                                return false;
                            }

                            my_patient.loadMoreList();
                            my_patient.isLoading = true;
                        }
                    });
                }else{
                    
                }

            } else {
                my_patient.loadingFlash = false;
                my_patient.hasPatient=false;
                return false;
            }
        });
    },
    loadMoreList: function() {
          my_patient.noMore=false;
          my_patient.loadingFlash = true;
          $.get(my_patient.next_page_url, function(ret) {
                console.log(ret);
                my_patient.patients = my_patient.patients.concat(ret.data);
                my_patient.loadingFlash = false;

                if (ret.meta.pagination.links.next) {
                    my_patient.next_page_url = ret.meta.pagination.links.next + '&token=' + my_patient.uToken;

                    my_patient.isLoading = false;
                 
                } else {
                    //my_patient.next_page_url = '';
                       my_patient.noMore=true;//显示无人了
                       my_patient.isLoading = true;

                }

            });
    }, //loadMoreList
    searchLoadMoreList: function() { 
          my_patient.loadingFlash = true;
          $.get(my_patient.next_page_url, function(ret) {
                console.log(ret);
                my_patient.patients = my_patient.patients.concat(ret.data);
                my_patient.loadingFlash = false;

                if (ret.meta.pagination.links.next) {
                    my_patient.next_page_url = ret.meta.pagination.links.next + '&token=' + my_patient.uToken+'&name='+my_patient.searchText;

                    my_patient.searchisLoading = false;
                 
                } else {
                    //my_patient.next_page_url = '';
                       my_patient.noMore=true;
                       my_patient.searchisLoading = true;

                }

            });
    }, //searchLoadMoreList
    searchPatients: function(event) {
        event.preventDefault();
       
        if (!my_patient.searchText) {
            layer.open({
                content: "请输入患者姓名", 
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;

        }
        console.log("点击了搜索");
        my_patient.noMore=false;
        //打开搜索开关，
        my_patient.searchisLoading = false;
        //关闭正常滑动开关
         my_patient.isLoading = true;
        my_patient.next_page_url=null;
        my_patient.loadingFlash = true;
        var url = xs_utils.getApiUrl("/api/patient/search", {
            "token": my_patient.uToken,
            "name": my_patient.searchText
        });
        $.get(url, function(ret) {

            console.log(ret);

            if (ret.data.length > 0) {
                my_patient.patients = ret.data;

                my_patient.loadingFlash = false;
                if (ret.meta.pagination.links.next) {
                    my_patient.next_page_url = ret.meta.pagination.links.next + '&token=' + my_patient.uToken+'&name='+my_patient.searchText;
                    // console.log(my_patient.next_page_url);
                    $(window).scroll(function(event) {
                        if (xs_utils.checkDocumentIsScrollToBottom()) {
                            if (my_patient.searchisLoading) {
                                return false;
                            }

                            my_patient.searchLoadMoreList();
                            my_patient.searchisLoading = true;
                        }
                    });
                }else{
                     my_patient.noMore=true;
                     my_patient.searchisLoading = true;
                }
            } else {
                my_patient.patients = ret.data;
                my_patient.loadingFlash = false;
                layer.open({
                    content: '暂无数据',
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;
            }

        });
    },

});

my_patient.$watch('searchText', function(value) {

    if (!value) {
        my_patient.getMyPatientsList();
        return false;
    }

});
$(function() {

    my_patient.init();
    //统一样式
    var u = navigator.userAgent; //用于判断手机类型
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        //
    }

});
