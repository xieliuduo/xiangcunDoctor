accessid = ''
accesskey = ''
host = ''
policyBase64 = ''
signature = ''
callbackbody = ''
filename = ''
key = ''
expire = 0
g_object_name = ''
g_object_name_type = ''
now = timestamp = Date.parse(new Date()) / 1000;

function send_request() {

    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp != null) {
        //serverUrl = '/api/common/upload/signature';
        serverUrl = xs_utils.getApiUrl("/api/common/upload/signature",{"token":add_help_poor.syToken});
        xmlhttp.open("GET", serverUrl, false);
        xmlhttp.send(null);
        // console.log(JSON.parse(xmlhttp.responseText));
        // return xmlhttp.responseText
        return JSON.parse(xmlhttp.responseText).data
    } else {
        alert("Your browser does not support XMLHTTP.");
    }
};

function check_object_radio() {
    g_object_name_type = 'random_name';
}

function get_signature() {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
        body = send_request()
            //console.log(body);
            // var obj = eval("(" + body + ")");
        var obj = body;
        host = obj['host']
        policyBase64 = obj['policy']
        accessid = obj['accessid']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        callbackbody = obj['callback']
        key = obj['dir']
        return true;
    }
    return false;
};

function get_time_for_filename() {
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var f = time.getMinutes();
    var s = time.getSeconds();
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    if (h < 10) {
        h = "0" + h;
    }
    if (f < 10) {
        f = "0" + f;
    }
    if (s < 10) {
        s = "0" + s;
    }
    var now = y + m + d + h + f + s;
    return now;
}

function random_string(len) {　　
    len = len || 32;　　
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';　　
    var maxPos = chars.length;　　
    var pwd = '';　　
    for (i = 0; i < len; i++) {　　
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return "image/" + pwd + get_time_for_filename();
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename) {
    suffix = get_suffix(filename)
    g_object_name = key + random_string(20) + suffix

    return ''
}

function get_uploaded_object_name(filename) {

    return g_object_name
}

function set_upload_param(up, filename, ret) {
    if (ret == false) {
        ret = get_signature()
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename)
        calculate_object_name(filename)
    }
    new_multipart_params = {
        'key': g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': callbackbody,
        'signature': signature,
    };

    up.setOption({
        'url': "http://" + host,
        'multipart_params': new_multipart_params
    });

    up.start();
}

//身份证正面
var uploader_id_card_front = new plupload.Uploader({
    type: 'post',
    browse_button: 'id_card_z_upload',
    url: 'http://oss.aliyuncs.com',
    multi_selection: false,

    filters: {
        mime_types: [ //只允许上传图片和zip,rar文件
            {
                title: "Image files",
                extensions: "jpg,gif,png,bmp"
            }
        ],
        max_file_size: '10mb', //最大只能上传10mb的文件
        prevent_duplicates: true //不允许选取重复文件
    },

    init: {

        FilesAdded: function(up, files) {
            set_upload_param(uploader_id_card_front, '', false);
            plupload.each(files, function(file) {
                console.log("上传文件名：" + file.name);
                // document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' + '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' + '</div>';
            });
        },

        BeforeUpload: function(up, file) {
            check_object_radio();
            set_upload_param(up, file.name, true);
        },
        FileUploaded: function(up, file, info) {
            if (info.status == 200) {

                //身份证正面
                add_help_poor.id_card_front = get_uploaded_object_name(file.name);


                console.log('上传成功,文件名为:' + get_uploaded_object_name(file.name));
            } else {
                console.log("上传失败");
            }
        },

        Error: function(up, err) {
            alert("上传出错");
        }
    }
});

//身份证反面
var uploader_id_card_back = new plupload.Uploader({
    type: 'post',
    browse_button: 'id_card_f_upload',
    url: 'http://oss.aliyuncs.com',
    multi_selection: false,

    filters: {
        mime_types: [ //只允许上传图片和zip,rar文件
            {
                title: "Image files",
                extensions: "jpg,gif,png,bmp"
            }
        ],
        max_file_size: '10mb', //最大只能上传10mb的文件
        prevent_duplicates: true //不允许选取重复文件
    },

    init: {

        FilesAdded: function(up, files) {
            set_upload_param(uploader_id_card_back, '', false);
            plupload.each(files, function(file) {
                console.log("上传文件名：" + file.name);
                // document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' + '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' + '</div>';
            });
        },

        BeforeUpload: function(up, file) {
            check_object_radio();
            set_upload_param(up, file.name, true);
        },
        FileUploaded: function(up, file, info) {
            if (info.status == 200) {

                //身份证正面
                add_help_poor.id_card_back = get_uploaded_object_name(file.name);


                console.log('上传成功,文件名为:' + get_uploaded_object_name(file.name));
            } else {
                console.log("上传失败");
            }
        },

        Error: function(up, err) {
            alert("上传出错");
        }
    }
});

//贫困照片
var uploader_pictures = new plupload.Uploader({
    type: 'post',
    browse_button: 'img_upload',
    url: 'http://oss.aliyuncs.com',
    resize:{
        width: "750"
    },
    filters: {
        mime_types: [ //只允许上传图片和zip,rar文件
            {
                title: "Image files",
                extensions: "jpg,gif,png,bmp"
            }
        ],
        max_file_size: '10mb', //最大只能上传10mb的文件
        prevent_duplicates: true //不允许选取重复文件
    },

    init: {

        FilesAdded: function(up, files) {
          //  getFile();
            console.log(files);
            console.log(files.length);
            if (files.length > 8) {
               // console.log("最多上传8张图片");
                layer.open({
                    content: '最多上传8张图片',
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;
            }
            set_upload_param(uploader_pictures, '', false);
        },

        BeforeUpload: function(up, file) {
            check_object_radio();
            set_upload_param(up, file.name, true);
        },
        FileUploaded: function(up, file, info) {
            console.log(up.total.uploaded);
            if (up.total.uploaded == 8) {
                $(".photo-list").eq(1).hide();
            }
            if (up.total.uploaded > 8) {
                layer.open({
                    content: '最多上传8张图片',
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;
            }
            //var ret = JSON.parse(response.response);
            if (info.status == 200) {
                add_help_poor.pictures_html += '<li><a><img src="http://siyuanfund.oss-cn-qingdao.aliyuncs.com/' + get_uploaded_object_name(file.name) + '?x-oss-process=image/resize,m_pad,h_150,w_150,color_46db96"></a></li>'
                //console.log(ret);
                add_help_poor.pictures.push(get_uploaded_object_name(file.name));
                // console.log(ret.data.download_url); //图片路径
                // console.log(ret.data.fileid); //图片id
            } else {
                console.log("上传失败");
            }

        },

        Error: function(up, err) {
            console.log("上传出错");
        }
    }
});

uploader_id_card_front.init();
uploader_id_card_back.init();
uploader_pictures.init();
