var var_province = '';
var var_city = '';
var var_district = '';

var uinfoedit = avalon.define({
    $id: "uinfoedit",
    loadingFlash:true,
    showInfo:false,
    syToken:xs_utils.getLocalStorage("syToken"),
    u_name: '',
    u_sex: '',
    u_age: '',
    u_tel: '',
    u_id_card: '',
    u_province: '',
    u_city: '',
    u_district: '',
    u_address: '',

    province_list: [],
    city_list: [],
    district_list: [],

    isPhone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
    isIdnum: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,

    getUserInfo: function() {
        var url = xs_utils.getApiUrl("/api/user/search-doctor", {
            "token":uinfoedit.syToken
        });

        $.get(url, function(ret) {
            console.log(ret);
            if (ret.data) {
                uinfoedit.u_name = ret.data.name;
                uinfoedit.u_sex = ret.data.gender;
                uinfoedit.u_age = ret.data.age;
                uinfoedit.u_tel = ret.data.phone;
                uinfoedit.u_id_card = ret.data.id_num;

                uinfoedit.u_province = ret.data.province_id;

                var_province = ret.data.province_id;
                var_city = ret.data.city_id;
                var_district = ret.data.district_id;

                uinfoedit.u_address = ret.data.address;
                uinfoedit.showInfo = true;
                uinfoedit.loadingFlash = false;
            } else {
                layer.open({
                    content: ret.message,
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                uinfoedit.loadingFlash = false;
            }
        });
    },
    checkValue: function() {

        if (!uinfoedit.u_name) {
            layer.open({
                content: "请输入姓名",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        if (!uinfoedit.u_sex) {
            layer.open({
                content: "请选择性别",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        if (!uinfoedit.u_age) {
            layer.open({
                content: "请输入年龄",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        if (!uinfoedit.u_tel) {
            layer.open({
                content: "请输入手机号码",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        } else {
            if (!uinfoedit.u_tel.match(uinfoedit.isPhone)) {
                layer.open({
                    content: "手机号码格式错误",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;
            }
        }

        if (!uinfoedit.u_id_card) {
            layer.open({
                content: "请输入身份证号",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        } else {
            if (!uinfoedit.u_id_card.match(uinfoedit.isIdnum)) {
                layer.open({
                    content: "身份证号格式错误",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;
            }
        }

        if (uinfoedit.u_province=="0") {
            layer.open({
                content: "请选择省",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        if (uinfoedit.u_city=="0") {
            layer.open({
                content: "请选择市",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        if (uinfoedit.u_province == "110000" || uinfoedit.u_province == "120000" || uinfoedit.u_province == "310000" || uinfoedit.u_province == "500000") {
           
        }else{
            if (uinfoedit.u_district=="0") {
                layer.open({
                    content: "请选择区县",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;
            }
        }

        if (!uinfoedit.u_address) {
            layer.open({
                content: "请输入详细地址",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }

        return true;

    },
    idCardCheck:function(){
        if (!uinfoedit.u_id_card) {
            // layer.open({
            //     content: "请输入身份证号",
            //     type: 1,
            //     time: 3,
            //     className: 'mylayer',
            //     shade: false
            // });
            return false;
        } else {
            if (!uinfoedit.u_id_card.match(uinfoedit.isIdnum)) {
                // layer.open({
                //     content: "身份证号格式错误",
                //     type: 1,
                //     time: 3,
                //     className: 'mylayer',
                //     shade: false
                // });
                return false;
            }
        }
        uinfoedit.u_age = uinfoedit.getAge();

        

    },
    getAge:function(){
        var birthday = uinfoedit.u_id_card.substr(6,8);
        var y = birthday.substr(0,4);
        var m = birthday.substr(4,2);
        var d = birthday.substr(6,2);
        
        var u_day = new Date(y+"-"+m+"-"+d).getTime();
        var today = new Date().getTime();
        var times = today-u_day;
        var age = Math.round(times/1000/60/60/24/365);
        return age;

    },
    submitUserInfo: function() {
        if (!uinfoedit.checkValue()) {
            return false;
        }
        console.log("提交");
        var url = xs_utils.getApiUrl("/api/user/edit-doctor", {
            "name": uinfoedit.u_name,
            "gender": uinfoedit.u_sex,
            "age": uinfoedit.u_age,
            "phone": uinfoedit.u_tel,
            "id_num": uinfoedit.u_id_card,
            "province_id": uinfoedit.u_province,
            "city_id": uinfoedit.u_city,
            "district_id": uinfoedit.u_district,
            "address": uinfoedit.u_address,
            "token":uinfoedit.syToken,
        });

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
                    location.href="u_info.html";
                },3000);
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
    getProvnces: function() {
        var provinces_url = xs_utils.getApiUrl('/api/area/province');
        $.get(provinces_url, function(list) {
            uinfoedit.province_list = list;
            if (var_province) {
                uinfoedit.u_province = var_province;
            }
        });

    },
    getCities: function(parent_id) {
        var city_url = xs_utils.getApiUrl('/api/area/city', { parent_id: parent_id });
        $.get(city_url, function(list) {
            uinfoedit.city_list = list;
            if (var_city) {
                uinfoedit.u_city = var_city;
            }
        });
    },
    getRegions: function(parent_id) {
        var region_url = xs_utils.getApiUrl('/api/area/district', { parent_id: parent_id });
        $.get(region_url, function(list) {
            uinfoedit.district_list = list;
            if (var_district) {
                uinfoedit.u_district = var_district;
            }
        });
    },


});

uinfoedit.$watch('u_province', function(value) {

    if (var_province != value) {
        var_city = "";
        var_district = "";
    }
    if (value == "110000" || value == "120000" || value == "310000" || value == "500000") {
        $("#quxian").hide();
    } else {
        $("#quxian").show();
    }
    uinfoedit.u_city = "";

    uinfoedit.u_district = "";
    uinfoedit.getCities(value);
});

uinfoedit.$watch('u_city', function(value) {
    if (uinfoedit.u_province == "110000" || uinfoedit.u_province == "120000" || uinfoedit.u_province == "310000" || uinfoedit.u_province == "500000") {
        uinfoedit.u_district = "";
        $("#quxian").hide();
    } else {
        $("#quxian").show();
        uinfoedit.u_district = "";
        uinfoedit.getRegions(value);
    }


});

$(function() {
    uinfoedit.getUserInfo();
    uinfoedit.getProvnces();
    $(".link-txt").tap(function() {
        uinfoedit.submitUserInfo();
    });
});
