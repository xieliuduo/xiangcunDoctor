//creat by xieliuduo 
var select_patient = avalon.define({
    $id: "select_patient",
    uToken: xs_utils.getLocalStorage("syToken"),
    tab:xs_utils.getQueryParam("tab"),
    hasPatient: true,//控制无人div显示
    searchText: "",
    patients: [], //患者列表
    noMore:false,//控制没有更多li显示
    loadingFlash: true,
    isLoading: true,
     searchisLoading:false,
     next_page_url: '',//加载更多的接口
    init: function() {

        select_patient.getMyPatientsList();

    },
    getMyPatientsList: function() {
        select_patient.isLoading = false;
        var url = xs_utils.getApiUrl("/api/patient/list", {
            "token": select_patient.uToken,
        });

        $.get(url, function(ret) {
            var len = ret.data.length; 
            if (len >= 1) {
                console.log(ret);
         
                select_patient.patients = ret.data;
                select_patient.loadingFlash = false;
                console.log(select_patient.patients);

                 if (ret.meta.pagination.links.next) {
                    select_patient.next_page_url = ret.meta.pagination.links.next + '&token=' + select_patient.uToken;
                   // console.log(select_patient.next_page_url);
                    $(window).scroll(function(event) {
                        if (xs_utils.checkDocumentIsScrollToBottom()) {
                           
                               if (select_patient.isLoading) {
                                return false;
                               }
                                select_patient.loadMoreList();
                                select_patient.isLoading=true;
                        }
                    });
                }
            } else {
                select_patient.loadingFlash = false;
                select_patient.hasPatient=false;
                
                return false;
            }
        });
    },
     loadMoreList: function() {
        select_patient.noMore=false;
         select_patient.loadingFlash = true;
          $.get(select_patient.next_page_url, function(ret) {
                console.log(ret);
                select_patient.patients = select_patient.patients.concat(ret.data);
                select_patient.loadingFlash = false;

                if (ret.meta.pagination.links.next) {
                    select_patient.next_page_url = ret.meta.pagination.links.next + '&token=' + select_patient.uToken;

                    select_patient.isLoading = false;
                 
                } else {
                    //select_patient.next_page_url = '';
                       select_patient.noMore=true;
                       select_patient.isLoading = true;

                }

            });
    },//loadMoreList
    searchLoadMoreList: function() { 
          select_patient.loadingFlash = true;
          $.get(select_patient.next_page_url, function(ret) {
                console.log(ret);
                select_patient.patients = select_patient.patients.concat(ret.data);
                select_patient.loadingFlash = false;

                if (ret.meta.pagination.links.next) {
                    select_patient.next_page_url = ret.meta.pagination.links.next + '&token=' + select_patient.uToken+'&name='+select_patient.searchText;

                    select_patient.searchisLoading = false;
                 
                } else {
                    //select_patient.next_page_url = '';
                       select_patient.noMore=true;
                       select_patient.searchisLoading = true;

                }

            });
    }, //searchLoadMoreList
    searchPatients: function(event) {
        event.preventDefault();
        if (!select_patient.searchText) {
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
        select_patient.noMore=false;
        //打开搜索开关，
        select_patient.searchisLoading = false;
        //关闭正常滑动开关
         select_patient.isLoading = true;
        select_patient.next_page_url=null;
        select_patient.loadingFlash = true;
        var url = xs_utils.getApiUrl("/api/patient/search", {
            "token": select_patient.uToken,
            "name": select_patient.searchText
        });
        $.get(url, function(ret) {

            console.log(ret);

            if (ret.data.length > 0) {
                select_patient.patients = ret.data;
                select_patient.loadingFlash = false;
                //加载更多
                if (ret.meta.pagination.links.next) {
                    select_patient.next_page_url = ret.meta.pagination.links.next + '&token=' + select_patient.uToken+'&name='+select_patient.searchText;
                    // console.log(select_patient.next_page_url);
                    $(window).scroll(function(event) {
                        if (xs_utils.checkDocumentIsScrollToBottom()) {
                            if (select_patient.searchisLoading) {
                                return false;
                            }

                            select_patient.searchLoadMoreList();
                            select_patient.searchisLoading = true;
                        }
                    });
                }else{
                     select_patient.noMore=true;
                     select_patient.searchisLoading = true;
                }
            } else {
                select_patient.patients = ret.data;
                select_patient.loadingFlash = false;
                //select_patient.noData = true;
                layer.open({
                    content: '暂无更多数据',
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;
            }


           


        });
    },

});//avalon

select_patient.$watch('searchText', function(value) {

    if (!value) {
        select_patient.getMyPatientsList();
        return false;
    }

});
$(function() {
    select_patient.init();
    //统一样式
    var u = navigator.userAgent; //用于判断手机类型
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        //
    }
});
