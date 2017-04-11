var $headTabs = $(".head-tab");
var $visitLs = $('.visit-ls');
var $diagLs = $('.diag-ls');
var $index = 2;
var $addlogo = $("#addlogo");

var diag_visit = avalon.define({
    $id: "diag_visit",
    uToken: xs_utils.getLocalStorage("syToken"),
    hasPatient: true, //控制无人div显示
    hasVisiter: true,
    searchText: "",
    patients: [], //患者列表
    visiters: [],
    noMore_v: false, //控制没有更多li显示
    noMore_p: false, //控制没有更多li显示
    loadingFlash: true,
    isLoading: false,
    isLoading2: false,
    searchisLoading: false,
    searchisLoading2: false,
    next_page_url: '', //加载更多的接口
    next_page_url_2: '', //加载更多的接口

    init: function() {
        diag_visit.getMyPatientsList();
        diag_visit.getMyVisitersList();
    },
    getMyPatientsList: function() {
        diag_visit.isLoading = false;
        var url = xs_utils.getApiUrl("/api/patient/follow-list", {
            "token": diag_visit.uToken,
            "service_type":0,
        });

        $.post(url, function(ret) {
            var len = ret.data.length;
            if (len >= 1) {
                console.log(ret);
                //确定有患者

                 temp = ret.data;
                for (var i = 0; i < temp.length; i++) {
                    temp[i].concise = temp[i].disease_desc.substring(0, 10) + '...';
                }
                diag_visit.patients = temp;

                diag_visit.loadingFlash = false;
                console.log(diag_visit.patients);

                if (ret.meta.pagination.links.next) {
                    diag_visit.next_page_url = ret.meta.pagination.links.next + '&token=' + diag_visit.uToken+'&service_type=0';
                    // console.log(diag_visit.next_page_url);
                    $(window).scroll(function(event) {
                        if ($index == 2) {
                            return false;
                        }
                        if (xs_utils.checkDocumentIsScrollToBottom()) {

                            if (diag_visit.isLoading) {
                                return false;
                            }
                            diag_visit.loadMoreListPatients();
                            diag_visit.isLoading = true;
                        }
                    });
                } else {

                }

            } else {
                diag_visit.loadingFlash = false;
                diag_visit.hasPatient = false;

            }
        });
    },
    getMyVisitersList: function() {
        diag_visit.isLoading2 = false;
        var url = xs_utils.getApiUrl("/api/patient/follow-list", {
            "token": diag_visit.uToken,
            "service_type":1,
        });

        $.post(url, function(ret) {
            var len = ret.data.length;
            var temp = [];
            if (len >= 1) {
                console.log(ret);
                //确定有患者

                // diag_visit.visiters = ret.data;
                temp = ret.data;
                for (var i = 0; i < temp.length; i++) {
                    temp[i].concise = temp[i].disease_desc.substring(0, 10) + '...';
                }
                diag_visit.visiters = temp;
                // for (var i = 0; i < diag_visit.visiters.length; i++) {
                //     diag_visit.visiters[i].concise = diag_visit.visiters[i].disease_desc.substring(0, 10) + '...';
                // }
                diag_visit.loadingFlash = false;

                console.log(diag_visit.visiters);

                if (ret.meta.pagination.links.next) {
                    diag_visit.next_page_url_2 = ret.meta.pagination.links.next + '&token=' + diag_visit.uToken+'&service_type=1';
                    // console.log(diag_visit.next_page_url);
                    $(window).scroll(function(event) {
                        if ($index == 1) {
                            return false;
                        }
                        if (xs_utils.checkDocumentIsScrollToBottom()) {
                            if (diag_visit.isLoading2) {
                                return false;
                            }
                            diag_visit.loadMoreListVisiters();
                            diag_visit.isLoading2 = true;
                        }
                    });
                }


            } else {
                diag_visit.loadingFlash = false;
                diag_visit.hasVisiter = false;

            }
        });
    },
    loadMoreListPatients: function() {
         diag_visit.noMore_p = false;
        diag_visit.loadingFlash = true;

        $.post(diag_visit.next_page_url, function(ret) {
            console.log(ret);
            diag_visit.patients = diag_visit.patients.concat(ret.data);
            for (var i = 0; i < diag_visit.patients.length; i++) {
                diag_visit.patients[i].concise = diag_visit.patients[i].disease_desc.substring(0, 10) + '...';
            }
            diag_visit.loadingFlash = false;

            if (ret.meta.pagination.links.next) {
                diag_visit.next_page_url = ret.meta.pagination.links.next + '&token=' + diag_visit.uToken+'&service_type=0';

                diag_visit.isLoading = false;

            } else {
                // diag_visit.next_page_url='';
                diag_visit.noMore_p = true;
                diag_visit.isLoading = true;

            }

        });

    }, //loadMoreListPatients
    searchLoadMoreList: function() {
         diag_visit.noMore_p = false;
        diag_visit.loadingFlash = true;
        $.post(diag_visit.next_page_url, function(ret) {
            console.log(ret);
            diag_visit.patients = diag_visit.patients.concat(ret.data);
             for (var i = 0; i < diag_visit.patients.length; i++) {
                diag_visit.patients[i].concise = diag_visit.patients[i].disease_desc.substring(0, 10) + '...';
            }
            diag_visit.loadingFlash = false;

            if (ret.meta.pagination.links.next) {
                diag_visit.next_page_url = ret.meta.pagination.links.next + '&token=' + diag_visit.uToken + '&name=' + diag_visit.searchText+'&service_type=0';

                diag_visit.searchisLoading = false;

            } else {
                //diag_visit.next_page_url = '';
                diag_visit.noMore_p = true;
                diag_visit.searchisLoading = true;

            }

        });
    }, //searchLoadMoreList
    loadMoreListVisiters: function() {
        diag_visit.noMore_v = false;
        diag_visit.loadingFlash = true;

        $.post(diag_visit.next_page_url_2, function(res) {
            console.log(res);
            diag_visit.visiters = diag_visit.visiters.concat(res.data);

            for (var i = 0; i < diag_visit.visiters.length; i++) {
                diag_visit.visiters[i].concise = diag_visit.visiters[i].disease_desc.substring(0, 10) + '...';
            }
            diag_visit.loadingFlash = false;

            if (res.meta.pagination.links.next) {
                diag_visit.next_page_url_2 = res.meta.pagination.links.next + '&token=' + diag_visit.uToken+'&service_type=1';

                diag_visit.isLoading2 = false;

            } else {
                diag_visit.noMore_v = true;
                diag_visit.isLoading2 = true;
            }

        });

    }, //loadMoreListPatients
    searchLoadMoreListVisiters: function() {
         diag_visit.noMore_v = false;
        diag_visit.loadingFlash = true;
        $.post(diag_visit.next_page_url, function(ret) {
            console.log(ret);
            diag_visit.visiters = diag_visit.visiters.concat(ret.data);
            for (var i = 0; i < diag_visit.visiters.length; i++) {
                diag_visit.visiters[i].concise = diag_visit.visiters[i].disease_desc.substring(0, 10) + '...';
            }
            diag_visit.loadingFlash = false;

            if (ret.meta.pagination.links.next) {
                diag_visit.next_page_url = ret.meta.pagination.links.next + '&token=' + diag_visit.uToken + '&name=' + diag_visit.searchText+'&service_type=1';

                diag_visit.searchisLoading2 = false;

            } else {
                //diag_visit.next_page_url = '';
                diag_visit.noMore_v = true;
                diag_visit.searchisLoading2 = true;

            }

        });
    }, //searchLoadMoreListVisiters


    search: function(event) {
        event.preventDefault();

        if (!diag_visit.searchText) {
            layer.open({
                content: "请输入患者姓名",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;

        }
        if ($index == 2) {
            console.log("随访点击了搜索");
            diag_visit.searchVisters();
        } else {
            console.log("就诊点击了搜索");
            diag_visit.searchPatients();
        }

    },
    searchPatients: function(event) {
        // event.preventDefault();


        diag_visit.noMore_p = false;
        diag_visit.searchisLoading = false;
        diag_visit.isLoading = true;
        diag_visit.next_page_url = null;
        diag_visit.loadingFlash = true;
        var url = xs_utils.getApiUrl("/api/patient/follow-search", {
            "token": diag_visit.uToken,
            "name": diag_visit.searchText,
             "service_type":0,
        });
        $.get(url, function(ret) {

            console.log(ret);

            if (ret.data.length > 0) {
                //diag_visit.patients = ret.data;
                 temp = ret.data;
                for (var i = 0; i < temp.length; i++) {
                    temp[i].concise = temp[i].disease_desc.substring(0, 10) + '...';
                }
                diag_visit.patients = temp;
                diag_visit.loadingFlash = false;
                // diag_visit.noData = false;
                if (ret.meta.pagination.links.next) {
                    diag_visit.next_page_url = ret.meta.pagination.links.next + '&token=' + diag_visit.uToken + '&name=' + diag_visit.searchText+'&service_type=0';
                    // console.log(diag_visit.next_page_url);
                    $(window).scroll(function(event) {
                        if (xs_utils.checkDocumentIsScrollToBottom()) {
                            if (diag_visit.searchisLoading) {
                                return false;
                            }

                            diag_visit.searchLoadMoreList();
                            diag_visit.searchisLoading = true;
                        }
                    });
                } else {
                    diag_visit.noMore_p = true;
                    diag_visit.searchisLoading = true;

                }
            } else {
                diag_visit.patients = ret.data;
                diag_visit.loadingFlash = false;
                //diag_visit.noData = true;
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
    }, //

    //
    searchVisters: function(event) {
        // event.preventDefault();
        diag_visit.noMore_v = false;
        diag_visit.searchisLoading2 = false;
        diag_visit.isLoading2 = true;
        diag_visit.next_page_url_2 = null;
        diag_visit.loadingFlash = true;

        var url = xs_utils.getApiUrl("/api/patient/follow-search", {
            "token": diag_visit.uToken,
            "name": diag_visit.searchText,
            "service_type":1,
        });
        $.post(url, function(ret) {

            console.log(ret);
            var temp = [];
            if (ret.data.length > 0) {
                temp = ret.data;
                for (var i = 0; i < temp.length; i++) {
                    temp[i].concise = temp[i].disease_desc.substring(0, 10) + '...';
                }
                diag_visit.visiters = temp;

                console.log(diag_visit.visiters);
                //temp=[];
                diag_visit.loadingFlash = false;
                // diag_visit.noData = false;
                if (ret.meta.pagination.links.next) {
                    diag_visit.next_page_url = ret.meta.pagination.links.next + '&token=' + diag_visit.uToken + '&name=' + diag_visit.searchText+'&service_type=1';
                    // console.log(diag_visit.next_page_url);
                    $(window).scroll(function(event) {
                        if (xs_utils.checkDocumentIsScrollToBottom()) {
                            if (diag_visit.searchisLoading2) {
                                return false;
                            }

                            diag_visit.searchLoadMoreListVisiters();
                            diag_visit.searchisLoading2 = true;
                        }
                    });
                } else {
                    diag_visit.noMore_v = true;
                    diag_visit.searchisLoading2 = true;
                }
            } else {
                diag_visit.visiters = ret.data;
                diag_visit.loadingFlash = false;
                //diag_visit.noData = true;
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
    }, //


    //

}); //avalon



diag_visit.$watch('searchText', function(value) {

    if (!value) {
        diag_visit.getMyPatientsList();
        diag_visit.getMyVisitersList();
        return false;
    }

});


$(function() {

    $diagLs.css('display', 'none');
    diag_visit.init();

    $headTabs.on("click", function() {
        //$index => 1,2
        diag_visit.searchText = '';
        $index = $(this).index();
        $(this).addClass('current')
            .siblings()
            .removeClass('current');
        if ($index == 1) {
            $visitLs.css('display', 'none');
            $diagLs.css('display', 'block');

          
             $addlogo.attr("href","add_visit.html?tab=diag");
          

        } else {
           

            $addlogo.attr("href","add_visit.html?tab=visit");
            $visitLs.css('display', 'block');
            $diagLs.css('display', 'none');
        }

    });

    var u = navigator.userAgent; //用于判断手机类型
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        //
    }
});
