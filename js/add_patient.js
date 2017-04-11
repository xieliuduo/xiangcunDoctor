var $goBack=$("#goBack");

var add_patient = avalon.define({
    $id: "add_patient", 

    uToken: xs_utils.getLocalStorage("syToken"),
    from: xs_utils.getQueryParam("from"),
    tab: xs_utils.getQueryParam("tab"),
    // hasPatient: "1", //有没有患者  1 ，表示有
    patient_img: '', //头像路经地址
    //'http://upload.jianshu.io/users/upload_avatars/2041831/c40f7c0555b7.jpeg', //头像路经地址
    u_avatar: '',
    name: '',
    sex: '',
    id_card:'',
    birthday: '',
    mobile: '',
    height: '',
    weight: '',
    jws: '', //既往史
    jzs: '', //家族史
    jbs: '', //什么历史
    jws_count: 0,
    jzs_count: 0,
    jbs_count: 0,
    lock: false,
    isPhone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
    isIdnum: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
    // imageInit: function() {
    //     add_patient.patient_uploader_init(); //初始化用户图像
    //     console.log();

    // },
    // patient_uploader_init: function() {

    //     // var api_url = xs_utils.getApiUrl("/activity/sdk", { "app_key": "AXkOV77Hs01epFowmUMq0URZCZeBdNis", "secret_key": "tTJyTam2Fupw4l1jqxBBHvTTO4pmH2T7" });
    //     var api_url = 'http://api.homedoctor.xieshoue.org//activity/sdk?app_key=AXkOV77Hs01epFowmUMq0URZCZeBdNis&secret_key=tTJyTam2Fupw4l1jqxBBHvTTO4pmH2T7';
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
    //                             add_patient.patient_img = ret.data.download_url;
    //                             console.log(add_patient.patient_img);
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
        //修改头像
        modifyUserAvatar: function() {
            var url = xs_utils.getApiUrl("/api/user/update-avatar", {
                "avatar": add_patient.u_avatar,
                "token": add_patient.uToken
            });
            console.log(add_patient.u_avatar);
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
    // textareaOnBlur: function(type) {
    //     if (type == 1) {
    //         add_patient.jws = add_patient.jws.replace(/\s/g, "");
    //     } else if (type == 2) {
    //         add_patient.jzs = add_patient.jzs.replace(/\s/g, "");
    //     } else if (type == 3) {
    //         add_patient.jbs = add_patient.jbs.replace(/\s/g, "");
    //     }

    // }, //textareaOnBlur
    textareaKeyup: function(type, num) {
        if (type == 1) {
            add_patient.jws_count = add_patient.jws.length;
            if (add_patient.jws_count >= num) {
                add_patient.jws_count = num;
            }
        } else if (type == 2) {
            add_patient.jzs_count = add_patient.jzs.length;
            if (add_patient.jzs_count >= num) {
                add_patient.jzs_count = num;
            }
        } else if (type == 3) {
            add_patient.jbs_count = add_patient.jbs.length;
            if (add_patient.jbs_count >= num) {
                add_patient.jbs_count = num;
            }
        }

     }, //抬起手触发
    textareaInput: function(type, num) {
        if (type == 1) {
            add_patient.jws_count = add_patient.jws.length;
            if (add_patient.jws_count >= num) {
                add_patient.jws = add_patient.jws.substring(0, num);
                add_patient.jws_count = num;
            }
        } else if (type == 2) {
            add_patient.jzs_count = add_patient.jzs.length;
            if (add_patient.jzs_count >= num) {
                 add_patient.jzs = add_patient.jzs.substring(0, num);
                add_patient.jzs_count = num;
            }
        } else if (type == 3) {
            add_patient.jbs_count = add_patient.jbs.length;
            if (add_patient.jbs_count >= num) {
                add_patient.jbs = add_patient.jbs.substring(0, num);
                add_patient.jbs_count = num;
            }
        }

    }, //抬起手触发
    //根据身份证号  推算生日
    getBirthday:function(value) {
            var tmpStr = "";
            var idDate = "";
            var tmpInt = 0;
            var strReturn = "";
            
            value = value.trim();
            
            if ((value.length != 15) && (value.length != 18)) {
            strReturn = "输入的身份证号位数错误";
            return strReturn;
            }
            
            if (value.length == 15) {
            tmpStr = value.substring(6, 12);
            tmpStr = "19" + tmpStr;
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6)
            
            return tmpStr;
            }
            else {
            tmpStr = value.substring(6, 14);
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6)
            
            return tmpStr;
            }
        },
        

    textareaOnFocus: function() {},
    //提交保存
    addPatient: function() {
        if (!add_patient.patient_img) {
            layer.open({
                content: "请上传头像",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (!add_patient.name) {
            layer.open({
                content: "请输入患者姓名",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (!add_patient.sex) {
            layer.open({
                content: "请选择性别",
                type: 1,
                time: 3, 
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        // if (!add_patient.birthday) {
        //     layer.open({
        //         content: "请输入出生日期",
        //         type: 1,
        //         time: 3,
        //         className: 'mylayer',
        //         shade: false
        //     });
        //     return false;
        // }
        if (!add_patient.mobile) {

            layer.open({
                content: "请输入手机号",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (!add_patient.mobile.match(add_patient.isPhone)) {
            layer.open({
                content: "手机号格式错误",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
         if (!add_patient.id_card) {

            layer.open({
                content: "请输入身份证号",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (!add_patient.id_card.match(add_patient.isIdnum)) {
            layer.open({
                content: "身份证号格式错误",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }else{
           add_patient.birthday=add_patient.getBirthday(add_patient.id_card);
        }
        
        if (!add_patient.height) {
            layer.open({
                content: "请输入身高",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (add_patient.height < 0 || add_patient.height > 400) {
            layer.open({
                content: "请输入合理身高",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (!add_patient.weight) {
            layer.open({
                content: "请输入体重",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (add_patient.weight < 0 || add_patient.weight > 300) {
            layer.open({
                content: "请输入合理体重",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        
        //  if (!add_patient.jws) {
        //     layer.open({
        //         content: "既往史不能为空",
        //         type: 1,
        //         time: 3,
        //         className: 'mylayer',
        //         shade: false
        //     });
        //     return false;
        // }
        if (!add_patient.jzs) {
            layer.open({
                content: "家族史不能为空",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (!add_patient.jbs) {
            layer.open({
                content: "疾病史不能为空",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        //阻止用户频繁点击保存。
        if (add_patient.lock) {
            return false;
        }
        add_patient.lock = true;
        var url = xs_utils.getApiUrl("/api/patient/add-patient", {
            "token": add_patient.uToken,
            "avatar": add_patient.u_avatar,
            "name": add_patient.name,
            "gender": add_patient.sex,
            "birthday": add_patient.birthday,
            "phone": add_patient.mobile,
            "id_card":add_patient.id_card,
            "height": add_patient.height,
            "weight": add_patient.weight,
            "past_history": add_patient.jws, //既往史
            "family_history": add_patient.jzs, //家族史
            "diseases_history": add_patient.jbs, //疾病历史


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
                    add_patient.lock = false;
                    if (add_patient.from) {
                        location.href = 'selectPatient.html?tab='+add_patient.tab;
                    }else{
                         location.href = 'my_patient.html';
                    }
                   
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
                    add_patient.lock = false;

                }, 1500);
            }
        });
    },

}); //定义avalon

// add_patient.$watch('medicinesName', function(value) {

//     if (!value) {
//         // my_patient.getMedicinesList();
//     }
// });
$(function() {
    var $recordTime = $(".record-time");
    console.log($recordTime);
    //监听粘贴事件
    
    if (add_patient.tab) {
        $goBack.attr("href","selectPatient.html?tab="+add_patient.tab);

    }else{
         $goBack.attr("href","my_patient.html");
    }

    // add_patient.imageInit();

    //统一样式
    var u = navigator.userAgent; //用于判断手机类型
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        //
    }
});
