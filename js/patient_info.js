var patient_info = avalon.define({ 
    $id: "patient_info",
    form: xs_utils.getQueryParam("form"),
    p_id: xs_utils.getQueryParam("p_id"),
    uToken: xs_utils.getLocalStorage("syToken"),
    patient_img: '', //头像路经地址
    u_avatar: '',
    name: '詹姆斯',
    sex: '1',
    id_card:'',
    birthday: '12-12-12',
    mobile: '123456765443',
    height: '180',
    weight: '65',
    jws: '无特殊', //既往史
    jzs: '无特殊', //家族史
    jbs: '无特殊', //什么历史
    serverRecords: [],
    init: function() {
        console.log(patient_info.uToken);
        patient_info.getPatientInfo();
        patient_info.getPatientRecords();

    },
    getPatientInfo: function() {
        var url = xs_utils.getApiUrl("/api/patient/detail", {
             "token": patient_info.uToken,
            "id": patient_info.p_id,

        });
        $.post(url, function(ret) {

            console.log(ret);
            if (ret.data) {
                patient_info.u_avatar = ret.data.avatar;

                if (patient_info.u_avatar.length > 30) {
                    patient_info.patient_img = 'http://siyuanfund.oss-cn-qingdao.aliyuncs.com/' + patient_info.u_avatar + '?x-oss-process=image/circle,r_600';

                }


                patient_info.name = ret.data.name;
                patient_info.sex = ret.data.gender;
                patient_info.birthday = ret.data.birthday;
                patient_info.id_card = ret.data.id_card;
                patient_info.mobile = ret.data.phone;
                patient_info.height = ret.data.height;
                patient_info.weight = ret.data.weight;
               // patient_info.jws = ret.data.past_history; //既往史
                patient_info.jzs = ret.data.family_history; //家族史
                patient_info.jbs = ret.data.diseases_history; //疾病历史
            } else {
                layer.open({
                    content: "服务器无响应",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });

            }

        });
    },
    getPatientRecords: function() {
        var url = xs_utils.getApiUrl("/api/patient/get-follow", {
              "token": patient_info.uToken,
            "patient_id": patient_info.p_id,

        });
        $.get(url, function(ret) {
            console.log(ret);
            patient_info.serverRecords = ret.data;

            //
            var $recordTime = $(".record-time");
            var $record_info = $(".record-info-list");

            console.log($recordTime);
            // $recordTime.find("img").eq(0).addClass('rotateDown');
            $recordTime.on("click", function() {

                $(this).siblings().toggle();
                if ($(this).siblings().css("display") == "block") {

                    $(this).find("img").addClass('rotateDown');

                } else {

                    $(this).find("img").removeClass('rotateDown');
                }
            });



            //


        });
    },
});
$(function() {



    patient_info.init();

    // var $recordTime = $(".record-time");
    // var $record_info = $(".record-info-list");

    // console.log($recordTime);
    // $recordTime.find("img").eq(0).addClass('rotateDown');
    // $recordTime.on("click", function() {

    //     $(this).siblings().toggle();
    //     if ($(this).siblings().css("display") == "block") {

    //         $(this).find("img").addClass('rotateDown');

    //     } else {

    //         $(this).find("img").removeClass('rotateDown');
    //     }
    // });




    //  $('#t1').val("123456789876543");
    //统一样式
    var u = navigator.userAgent; //用于判断手机类型
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        //
    }
});
