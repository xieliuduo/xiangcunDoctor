var visit_info = avalon.define({ 
    $id: "visit_info",
    p_id: xs_utils.getQueryParam("p_id"),
    uToken: xs_utils.getLocalStorage("syToken"),
    name: '',
    date: '',
    service_type_name: '',
    heart_rate:'',
    systolic_pressure: '', 
    diastolic_pressure: '',
    blood_sugar: '', //
    describe: '', //
    guide: '', //
    drug_record:'',
    service_type:'',
    init: function() {
        console.log(visit_info.uToken);
        visit_info.getPatientInfo();


    },
    getPatientInfo: function() {
        var url = xs_utils.getApiUrl("/api/patient/detail-follow", {
             "token": visit_info.uToken,
            "id": visit_info.p_id,
           
        });
        $.post(url, function(ret) {

            console.log(ret);
            if (ret.data) {
               
                visit_info.name = ret.data.name;
              
                visit_info.date = ret.data.service_date;

                
                visit_info.heart_rate = ret.data.heart_rate;
                visit_info.diastolic_pressure = ret.data.diastolic_pressure; //既往史
                visit_info.systolic_pressure = ret.data.systolic_pressure; //家族史
                visit_info.blood_sugar = ret.data.blood_sugar; //疾病历史
                visit_info.describe = ret.data.disease_desc;

                visit_info.guide = ret.data.guide;
              
                visit_info.drug_record = ret.data.drug_record;
                if (ret.data.service_type==1) {
                     visit_info.service_type = "高血压随访";
                }else if(ret.data.service_type==2){
                     visit_info.service_type = "糖尿病随访";
                }else if(ret.data.service_type==3){
                     visit_info.service_type = "上门随访";
                }else if(ret.data.service_type==4){
                     visit_info.service_type = "门诊随访";
                }   


               
            }else{
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
});
$(function() {


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

    visit_info.init();





    //  $('#t1').val("123456789876543");
    //统一样式
    var u = navigator.userAgent; //用于判断手机类型
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        //
    }
});
