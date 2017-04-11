 var patient_edit = avalon.define({  

     $id: "patient_edit",
     p_id: xs_utils.getQueryParam("p_id"),
     uToken: xs_utils.getLocalStorage("syToken"),
     patient_img: '', //头像路经地址
     u_avatar:'',
     name: '',
     sex: '',
     birthday: '',
     mobile: '', 
     id_card:'',
     height: '',
     weight: '',
     jws: '', //既往史
     jzs: '', //家族史
     jbs: '', //什么历史
    serverRecords: [],
     jws_count: 0,
     jzs_count: 0,
     jbs_count: 0,
     lock:false,
     isPhone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
     init: function() {
         patient_edit.getPatientInfo();
         patient_edit.getPatientRecords();

     },
     // imageInit: function() {
     //     patient_edit.patient_uploader_init(); //初始化用户图像

     // },
     getPatientInfo: function() {
         var url = xs_utils.getApiUrl("/api/patient/detail", {
            "token": patient_edit.uToken,
             "id": patient_edit.p_id,

         });
         $.post(url, function(ret) {

             console.log(ret);
             if (ret.data.name) {
                 patient_edit.u_avatar = ret.data.avatar;
                 
                 if (patient_edit.u_avatar.length>30) {
                    patient_edit.patient_img='http://siyuanfund.oss-cn-qingdao.aliyuncs.com/'+patient_edit.u_avatar+'?x-oss-process=image/circle,r_600';
                }


                 patient_edit.name = ret.data.name;
                 patient_edit.sex = ret.data.gender;
                 patient_edit.birthday = ret.data.birthday;
                 patient_edit.mobile = ret.data.phone;
                 patient_edit.height = ret.data.height;
                 patient_edit.weight = ret.data.weight;
                 patient_edit.id_card = ret.data.id_card;   
                 //patient_edit.jws = ret.data.past_history; //既往史
                 patient_edit.jzs = ret.data.family_history; //家族史
                 patient_edit.jbs = ret.data.diseases_history; //疾病历史
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
             "token": patient_edit.uToken,
             "patient_id": patient_edit.p_id,

         });
         $.get(url, function(ret) {
             console.log(ret);
             patient_edit.serverRecords = ret.data;

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
     updatePatient: function() {
         if (!patient_edit.patient_img) {
             layer.open({
                 content: "请长传头像",
                 type: 1,
                 time: 3,
                 className: 'mylayer',
                 shade: false
             });
             return false;
         }
         if (!patient_edit.name) {
             layer.open({
                 content: "请输入患者姓名",
                 type: 1,
                 time: 3,
                 className: 'mylayer',
                 shade: false
             });
             return false;
         }
         if (!patient_edit.sex) {
             layer.open({
                 content: "请选择性别",
                 type: 1,
                 time: 3,
                 className: 'mylayer',
                 shade: false
             });
             return false;
         }
         if (!patient_edit.birthday) {
             layer.open({
                 content: "请输入出生日期",
                 type: 1,
                 time: 3,
                 className: 'mylayer',
                 shade: false
             });
             return false;
         }
         if (!patient_edit.mobile) {

             layer.open({
                 content: "请输入手机号",
                 type: 1,
                 time: 3,
                 className: 'mylayer',
                 shade: false
             });
             return false;
         }
         if (!patient_edit.isPhone) {
             layer.open({
                 content: "手机号格式错误",
                 type: 1,
                 time: 3,
                 className: 'mylayer',
                 shade: false
             });
             return false;
         }
         if (!patient_edit.height) {
             layer.open({
                 content: "请输入身高",
                 type: 1,
                 time: 3,
                 className: 'mylayer',
                 shade: false
             });
             return false;
         }
         if (!patient_edit.weight) {
             layer.open({
                 content: "请输入体重",
                 type: 1,
                 time: 3,
                 className: 'mylayer',
                 shade: false
             });
             return false;
         }
         //阻止用户频繁点击保存。
         if (patient_edit.lock) {
             return false;
         }
         patient_edit.lock = true;
         var url = xs_utils.getApiUrl("/api/patient/update-patient", {
            "patient_id":patient_edit.p_id,
             "token": patient_edit.uToken,
             "avatar": patient_edit.u_avatar,
             "name": patient_edit.name,
             "gender": patient_edit.sex,
             "birthday": patient_edit.birthday,
             "phone": patient_edit.mobile,
             "height": patient_edit.height,
             "weight": patient_edit.weight,
             "past_history": patient_edit.jws, //既往史
             "family_history": patient_edit.jzs, //家族史
             "diseases_history": patient_edit.jbs, //疾病历史


         });

         $.post(url, function(ret) {
             console.log(ret);
             if (ret.status_code == "200") {
                 layer.open({
                     content: ret.message,
                     type: 1,
                     time: 3,
                     className: 'mylayer',
                     shade: false
                 });
                 setTimeout(function() {
                     patient_edit.lock = false;
                     location.href = 'patient_info.html?p_id='+patient_edit.p_id;
                 }, 1500);
             } else {
                 layer.open({
                     content: "服务器暂无响应",
                     type: 1,
                     time: 3,
                     className: 'mylayer',
                     shade: false
                 });
                 setTimeout(function() {
                     patient_edit.lock = false;

                 }, 1500);
             }
         });
     },
      //修改头像
    modifyUserAvatar: function() {
        var url = xs_utils.getApiUrl("/api/user/update-avatar", {
            "avatar": patient_edit.u_avatar,
            "token": patient_edit.uToken
        });
        console.log(patient_edit.u_avatar);
        $.post(url, function(ret) {
            console.log(ret);
            if (ret.status_code == "200") {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
              
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
     // patient_uploader_init: function() {
     //     // var api_url = xs_utils.getApiUrl("/activity/sdk", { "app_key": "AXkOV77Hs01epFowmUMq0URZCZeBdNis", "secret_key": "tTJyTam2Fupw4l1jqxBBHvTTO4pmH2T7" });
     //     var api_url='http://api.homedoctor.xieshoue.org//activity/sdk?app_key=AXkOV77Hs01epFowmUMq0URZCZeBdNis&secret_key=tTJyTam2Fupw4l1jqxBBHvTTO4pmH2T7';
     //     $.post(api_url, function(ret) {
     //         if (ret) {
     //             console.log(ret.data.url, ret.data.sign);
     //             var request_url = ret.data.url + '?sign=' + encodeURIComponent(ret.data.sign);

     //             var $avatar_uploader = $("#image");
     //             var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
     //                 type: 'post',
     //                 browse_button: 'img_upload',
     //                 url: request_url,
     //                 max_file_size: '5mb',
     //                 multi_selection: false,
     //                 file_data_name: 'fileContent',
     //                 filters: {
     //                     mime_types: [ //只允许上传图片文件
     //                         { title: "图片文件", extensions: "jpg,gif,png" }
     //                     ]
     //                 },
     //                 multipart_params: {
     //                     type: 'avatar'
     //                 },
     //                 init: {
     //                     FilesAdded: function(up, files) {
     //                         uploader.start();
     //                     },
     //                     UploadProgress: function(up, file) {},
     //                     FileUploaded: function(uploader, file, response) {
     //                         var ret = JSON.parse(response.response);
     //                         if (ret.code == 0) {
     //                             patient_edit.patient_img = ret.data.download_url;
     //                             console.log(patient_edit.patient_img);
     //                             console.log(ret.data.download_url); //图片路径
     //                             console.log(ret.data.fileid); //图片id
     //                         } else {
     //                             alert(ret.message);
     //                         }
     //                     },
     //                     Error: function(up, err) {
     //                         //alert("上传出错！" + err.code + ":" + err.message);
     //                         layer.open({
     //                             content: '上传出错',
     //                             type: 1,
     //                             time: 3,
     //                             className: 'mylayer',
     //                             shade: false
     //                         });
     //                     }
     //                 }
     //             });

     //             uploader.init(); //初始化

     //         } else {
     //             console.log("无数据");
     //         }
     //     });
     // }, //上传头像函数


     // textareaOnBlur: function(type) {
     //     if (type == 1) {
     //         patient_edit.jws = patient_edit.jws.replace(/\s/g, "");
     //     } else if (type == 2) {
     //         patient_edit.jzs = patient_edit.jzs.replace(/\s/g, "");
     //     } else if (type == 3) {
     //         patient_edit.jbs = patient_edit.jbs.replace(/\s/g, "");
     //     }

     // }, //textareaOnBlur
     textareaKeyup: function(type, num) {
         if (type == 1) {
             patient_edit.jws_count = patient_edit.jws.length;
             if (patient_edit.jws_count >= num) {
                 patient_edit.jws_count = num;
             }
         } else if (type == 2) {
             patient_edit.jzs_count = patient_edit.jzs.length;
             if (patient_edit.jzs_count >= num) {
                 patient_edit.jzs_count = num; 
             }
         } else if (type == 3) {
             patient_edit.jbs_count = patient_edit.jbs.length;
             if (patient_edit.jbs_count >= num) {
                 patient_edit.jbs_count = num;
             }
         }

     }, //抬起手触发

     textareaInput: function(type, num) {
         if (type == 1) {
             patient_edit.jws_count = patient_edit.jws.length;
             if (patient_edit.jws_count >= num) {
                 patient_edit.jws = patient_edit.jws.substring(0, num);
                 patient_edit.jws_count = num;
             }
         } else if (type == 2) {
             patient_edit.jzs_count = patient_edit.jzs.length;
             if (patient_edit.jzs_count >= num) {
                  patient_edit.jzs = patient_edit.jzs.substring(0, num);
                 patient_edit.jzs_count = num;
             }
         } else if (type == 3) {
             patient_edit.jbs_count = patient_edit.jbs.length;
             if (patient_edit.jbs_count >= num) {
                 patient_edit.jbs = patient_edit.jbs.substring(0, num);
                 patient_edit.jbs_count = num;
             }
         }

     }, //抬起手触发

     textareaOnFocus: function() {}
 });
 $(function() {
     var $recordTime = $(".record-time");
     var $record_info = $(".record-info-list");

     console.log($recordTime);
     $recordTime.find("img").eq(0).addClass('rotateDown');
     $recordTime.on("click", function() {

         $(this).siblings().toggle();
         if ($(this).siblings().css("display") == "block") {

             $(this).find("img").addClass('rotateDown');

         } else {

             $(this).find("img").removeClass('rotateDown');
         }
     });

      patient_edit.init();
     // patient_edit.imageInit();
     //统一样式
     var u = navigator.userAgent; //用于判断手机类型
     var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
     if (isiOS) {
         //
     }
 });
