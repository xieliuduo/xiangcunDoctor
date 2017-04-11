var add_help_poor = avalon.define({
    $id: "add_help_poor",
    date:'',
    name:'',
    gender:'',
    phone:'',
    id_card_front:'',
    id_card_back:'',
    family_annual_income:'',//收入
    poverty_reasons:'',
    family_desc:'',
    help_desc:'',
    pictures:[],
    status:'',
    syToken:xs_utils.getLocalStorage("syToken"),
    poverty_reasons_count:0, //致贫原因字数
    family_desc_count:0,//家庭描述字数
    help_desc_count:0,//救助描述字数
    pictures_html:'',
    isNum:/^[0-9]+$/,
    isPhone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
    isIdnum: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
    textareaKeyup:function(id){
        switch(id){
            case "poverty_reasons":
            add_help_poor.poverty_reasons_count = add_help_poor.poverty_reasons.replace(/\s/g,"").length;
            if(add_help_poor.poverty_reasons_count>=20){
             add_help_poor.poverty_reasons_count = 20;
            }
            break;
            case "family_desc":
            add_help_poor.family_desc_count = add_help_poor.family_desc.replace(/\s/g,"").length;
            if(add_help_poor.family_desc_count>=50){
             add_help_poor.family_desc_count = 50;
            }
            break;
            case "help_desc":
            add_help_poor.help_desc_count = add_help_poor.help_desc.replace(/\s/g,"").length;
            if(add_help_poor.help_desc_count>=50){
             add_help_poor.help_desc_count = 50;
            }
            break;
        }
       
    },
    textareaInput:function(id){
        switch(id){
            case "poverty_reasons":
            add_help_poor.poverty_reasons_count = add_help_poor.poverty_reasons.replace(/\s/g,"").length;
            if(add_help_poor.poverty_reasons_count>=20){
             add_help_poor.poverty_reasons_count = 20;
            }
            break;
            case "family_desc":
            add_help_poor.family_desc_count = add_help_poor.family_desc.replace(/\s/g,"").length;
            if(add_help_poor.family_desc_count>=50){
             add_help_poor.family_desc_count = 50;
            }
            break;
            case "help_desc":
            add_help_poor.help_desc_count = add_help_poor.help_desc.replace(/\s/g,"").length;
            if(add_help_poor.help_desc_count>=50){
             add_help_poor.help_desc_count = 50;
            }
            break;
        }
       
    },
    getToday:function(){
        var today = new Date();
        var year  = today.getFullYear();
        var mon = today.getMonth()+1;
        var day = today.getDate();
        //console.log(year+'-'+mon+'-'+day);
        add_help_poor.date = year+'-'+mon+'-'+day;//申请日期 自动获取当天日期
    },
    imageInit: function() {
        add_help_poor.image_id_card_z_uploader_init();//身份证正面
        add_help_poor.image_id_card_f_uploader_init();//身份证反面
        add_help_poor.image_uploader_init();//八张扶贫照片
    },
    image_id_card_z_uploader_init: function() {
        var api_url = "http://api.homedoctor.xieshoue.org/activity/sdk?app_key=AXkOV77Hs01epFowmUMq0URZCZeBdNis&secret_key=tTJyTam2Fupw4l1jqxBBHvTTO4pmH2T7";
        $.post(api_url, function(ret) {
            if (ret) {
                console.log(ret.data.url, ret.data.sign);
                var request_url = ret.data.url + '?sign=' + encodeURIComponent(ret.data.sign);

                var $avatar_uploader = $("#image");
                var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                    type: 'post',
                    browse_button: 'id_card_z_upload',
                    url: request_url,
                    max_file_size: '5mb',
                    multi_selection: false,
                    file_data_name: 'fileContent',
                    filters: {
                        mime_types: [ //只允许上传图片文件
                            { title: "图片文件", extensions: "jpg,gif,png" }
                        ]
                    },
                    multipart_params: {
                        type: 'avatar'
                    },
                    init: {
                        FilesAdded: function(up, files) {
                            uploader.start();
                        },
                        UploadProgress: function(up, file) {},
                        FileUploaded: function(uploader, file, response) {
                            var ret = JSON.parse(response.response);
                            if (ret.code == 0) {
                                add_help_poor.id_card_front = ret.data.download_url;
                                console.log(ret.data.download_url); //图片路径
                                console.log(ret.data.fileid); //图片id
                            } else {
                                alert(ret.message);
                            }
                        },
                        Error: function(up, err) {
                            //alert("上传出错！" + err.code + ":" + err.message);
                            layer.open({
                                content: '上传出错',
                                type: 1,
                                time: 3,
                                className: 'mylayer',
                                shade: false
                            });
                        }
                    }
                });

                uploader.init(); //初始化

            } else {
                console.log("无数据");
            }
        });
    },
    image_id_card_f_uploader_init: function() {
        // var api_url = xs_utils.getApiUrl("/activity/sdk", { "app_key": "AXkOV77Hs01epFowmUMq0URZCZeBdNis", "secret_key": "tTJyTam2Fupw4l1jqxBBHvTTO4pmH2T7" });
        var api_url = "http://api.homedoctor.xieshoue.org/activity/sdk?app_key=AXkOV77Hs01epFowmUMq0URZCZeBdNis&secret_key=tTJyTam2Fupw4l1jqxBBHvTTO4pmH2T7";
        $.post(api_url, function(ret) {
            if (ret) {
                console.log(ret.data.url, ret.data.sign);
                var request_url = ret.data.url + '?sign=' + encodeURIComponent(ret.data.sign);

             
                var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                    type: 'post',
                    browse_button: 'id_card_f_upload',
                    url: request_url,
                    max_file_size: '5mb',
                    multi_selection: false,
                    file_data_name: 'fileContent',
                    filters: {
                        mime_types: [ //只允许上传图片文件
                            { title: "图片文件", extensions: "jpg,gif,png" }
                        ]
                    },
                    multipart_params: {
                        type: 'avatar'
                    },
                    init: {
                        FilesAdded: function(up, files) {
                            uploader.start();
                        },
                        UploadProgress: function(up, file) {},
                        FileUploaded: function(uploader, file, response) {
                            var ret = JSON.parse(response.response);
                            if (ret.code == 0) {
                                add_help_poor.id_card_back = ret.data.download_url;
                                console.log(ret.data.download_url); //图片路径
                                console.log(ret.data.fileid); //图片id
                            } else {
                                alert(ret.message);
                            }
                        },
                        Error: function(up, err) {
                            //alert("上传出错！" + err.code + ":" + err.message);
                            layer.open({
                                content: '上传出错',
                                type: 1,
                                time: 3,
                                className: 'mylayer',
                                shade: false
                            });
                        }
                    }
                });

                uploader.init(); //初始化

            } else {
                console.log("无数据");
            }
        });
    },
    image_uploader_init: function() {
        var api_url = "http://api.homedoctor.xieshoue.org/activity/sdk?app_key=AXkOV77Hs01epFowmUMq0URZCZeBdNis&secret_key=tTJyTam2Fupw4l1jqxBBHvTTO4pmH2T7";
        $.post(api_url, function(ret) {
            if (ret) {
                console.log(ret.data.url, ret.data.sign);
                var request_url = ret.data.url + '?sign=' + encodeURIComponent(ret.data.sign);

                var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
                    type: 'post',
                    browse_button: 'image_url',
                    url: request_url,
                    max_file_size: '5mb',
                    multi_selection: true,
                    file_data_name: 'fileContent',
                    filters: {
                        mime_types: [ //只允许上传图片文件
                            { title: "图片文件", extensions: "jpg,gif,png" }
                        ]
                    },
                    multipart_params: {
                        type: 'image'
                    },
                    init: {
                        FilesAdded: function(up, files) {
                            console.log(files.length);
                            if(files.length>8){
                                console.log("最多上传8张图片");
                                layer.open({
                                    content: '最多上传8张图片',
                                    type: 1,
                                    time: 3,
                                    className: 'mylayer',
                                    shade: false
                                });
                                return false;
                            }
                            uploader.start();
                        },
                        UploadProgress: function(up, file) {},
                        FileUploaded: function(uploader, file, response) {
                            console.log(uploader.total.uploaded);
                            if(uploader.total.uploaded==8){
                                $(".photo-list").eq(1).hide();
                            }
                            if(uploader.total.uploaded>8){
                                layer.open({
                                    content: '最多上传8张图片',
                                    type: 1,
                                    time: 3,
                                    className: 'mylayer',
                                    shade: false
                                });
                                return false;
                            }
                            var ret = JSON.parse(response.response);
                            if (ret.code == 0) {
                                add_help_poor.pictures_html += '<li><a><img src="'+ret.data.download_url+'"></a></li>'
                                console.log(ret);
                                add_help_poor.pictures.push(ret.data.download_url);
                                console.log(ret.data.download_url); //图片路径
                                console.log(ret.data.fileid); //图片id
                            } else {
                                alert(ret.message);
                            }
                        },
                        Error: function(up, err) {
                            //alert("上传出错！" + err.code + ":" + err.message);
                            layer.open({
                                content: '上传出错',
                                type: 1,
                                time: 3,
                                className: 'mylayer',
                                shade: false
                            });
                        }
                    }
                });

                uploader.init(); //初始化

            } else {
                console.log("无数据");
            }
        });
    },
    addHelpPoor:function(){
        if(!add_help_poor.name){
           layer.open({
                content: "请输入姓名",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
           //$("#name").focus();
           return false;
        }

        if(!add_help_poor.gender){
           layer.open({
                content: "请选择性别",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
          // $("#name").focus();
           return false;
        }

        if(!add_help_poor.phone){
           layer.open({
                content: "请输入手机号",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
           //$("#phone").focus();
           return false;
        } else {
            if (!add_help_poor.phone.match(add_help_poor.isPhone)) {
                layer.open({
                    content: "请输入正确的手机号",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                //$("#phone").focus();
                return false;
            }
        }

        if(!add_help_poor.id_card_front){
           layer.open({
                content: "请上传身份证正面",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
           return false;
        }

        if(!add_help_poor.id_card_back){
           layer.open({
                content: "请上传身份证反面",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
           return false;
        }

        if(!add_help_poor.family_annual_income){
           layer.open({
                content: "请输入家庭年收入",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
           //$("#family_annual_income").focus();
           return false;
        } else {
            if (!add_help_poor.family_annual_income.match(add_help_poor.isNum)) {
                layer.open({
                    content: "年收入需为正整数",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
               // $("#family_annual_income").focus();
                return false;
            }
        }

        if(!add_help_poor.poverty_reasons){
           layer.open({
                content: "请输入致贫原因",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
          // $("#poverty_reasons").focus();
           return false;
        }

        if(!add_help_poor.family_desc){
           layer.open({
                content: "请输入家庭描述",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
          // $("#family_desc").focus();
           return false;
        }

        if(!add_help_poor.help_desc){
           layer.open({
                content: "请输入救助需求",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
          // $("#help_desc").focus();
           return false;
        }

        if(!add_help_poor.pictures_html){
            //console.log(add_help_poor.pictures);
           layer.open({
                content: "请上传贫困图片",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            }); 
           return false;
        }


        var url = xs_utils.getApiUrl("/api/poverty-relief/add", {
            "name":add_help_poor.name,
            "gender":add_help_poor.gender,
            "phone":add_help_poor.phone,
            "id_card_front":add_help_poor.id_card_front,
            "id_card_back":add_help_poor.id_card_back,
            "family_annual_income":add_help_poor.family_annual_income,
            "poverty_reasons":add_help_poor.poverty_reasons,
            "family_desc":add_help_poor.family_desc,
            "help_desc":add_help_poor.help_desc,
            "pictures":add_help_poor.pictures,
            "token":add_help_poor.syToken,
            "status":"已申请"
        });

        $(".btn-block").addClass('disabled');
        $(".btn-block").prop("disabled",true);

        $.post(url, function(ret) {
            console.log(ret);
            if (ret.status_code=="200") {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                setTimeout(function(){
                   // location.href='help_poor_list.html';
                    location.href='index.html';
                },3000);
            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                $(".btn-block").removeClass('disabled');
                $(".btn-block").removeAttr('disabled');
            }
        });
    }
});

$(function(){
    add_help_poor.getToday();
   // add_help_poor.imageInit();
});