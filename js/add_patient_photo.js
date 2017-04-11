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
        serverUrl = xs_utils.getApiUrl("/api/common/upload/signature",{"token":add_patient.uToken});
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
    return "avatar/" + pwd + get_time_for_filename();
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

var uploader = new plupload.Uploader({
    type: 'post',
    browse_button: 'postfiles',
    url: 'http://oss.aliyuncs.com',

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
            set_upload_param(uploader, '', false);
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
                add_patient.u_avatar = get_uploaded_object_name(file.name);
                //换头像
                if (add_patient.u_avatar.length>30) {
                    add_patient.patient_img='http://siyuanfund.oss-cn-qingdao.aliyuncs.com/'+add_patient.u_avatar+'?x-oss-process=image/circle,r_600';
                }
                add_patient.modifyUserAvatar();


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

uploader.init();