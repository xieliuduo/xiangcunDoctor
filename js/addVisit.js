
var $toSelect = $("#toSelect");  

var add_visit = avalon.define({
    $id: "add_visit",
    tab:xs_utils.getQueryParam("tab"),
    p_id: xs_utils.getQueryParam("p_id"),
    p_name: xs_utils.getQueryParam("p_name"),
    uToken: xs_utils.getLocalStorage("syToken"),
    name: '',
    date: '',
    service_type: '1',
    optionType:'',
    sex: '',
    service_type_name: '1',
    mobile: '',
    describe: '', //既往史
    guide: '', //家族史
    drug_record: '', //什么历史
    count1: 0,
    count2: 0,
    count3: 0,
    heart_rate: '',
    blood_sugar: '',
    numList: [],
    heart_rate_list:[],
    blood_sugar_list:[],
    systolic_pressure: '0', //收缩压 高压
    diastolic_pressure: '0', //舒张压  低压
    lock: false,
    isPhone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
    init: function() {
        if (add_visit.p_id) {
            add_visit.name = decodeURIComponent(add_visit.p_name);
        }
        add_visit.getDate();

        for (var i = 30; i < 301; i++) {
            add_visit.numList.push(i);

        }
        for (var i = 30; i < 121; i++) {
            add_visit.heart_rate_list.push(i);
        }
        for (var i = 0; i < 34; i++) {
            add_visit.blood_sugar_list.push(i);
        }

        if (add_visit.tab=="diag") {
            add_visit.optionType={"1":"门诊随访"};

        }else{
            add_visit.optionType={
                "1":"高血压随访",
                "2":"糖尿病随访",
                "3":"上门随访"
            };
        }

    },
    addVisiter: function() {


        if (!add_visit.name) {
            layer.open({
                content: "请选择服务对象",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (add_visit.heart_rate) {
            if (add_visit.heart_rate < 30 || add_visit.heart_rate > 120) {
                layer.open({
                    content: "请输入合理心率",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;

            }

        }
         if (add_visit.systolic_pressure==0) {
           
                layer.open({
                    content: "请输入收缩压",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false; 

            
        }
        if (add_visit.diastolic_pressure==0) {
           
                layer.open({
                    content: "请输入舒张压",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;

            
        }
         if (add_visit.systolic_pressure <= add_visit.diastolic_pressure) {
           
                layer.open({
                    content: "收缩压应大于舒张压",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;

            
        }
        if (add_visit.blood_sugar) {
            if (add_visit.blood_sugar < 0 || add_visit.blood_sugar > 33) {
                layer.open({
                    content: "请输入合理血糖值",
                    type: 1,
                    time: 3,
                    className: 'mylayer',
                    shade: false
                });
                return false;

            }
        }
        if (!add_visit.describe) {
            layer.open({
                content: "请填写疾病描述",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (!add_visit.guide) {
            layer.open({
                content: "请填写指导建议",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
        if (!add_visit.drug_record) {
            layer.open({
                content: "请填写开药记录",
                type: 1,
                time: 3,
                className: 'mylayer',
                shade: false
            });
            return false;
        }
         if (add_visit.tab=="diag") {
            add_visit.service_type=4;
        }
        if (add_visit.lock) {
            return false;
        }
        add_visit.lock = true;
        var url = xs_utils.getApiUrl("/api/patient/follow", {
            "token": add_visit.uToken,
            "patient_id": add_visit.p_id,
            "service_type": add_visit.service_type,
            "service_date": add_visit.date,
            "disease_desc": add_visit.describe,
            "guide": add_visit.guide,
            "drug_record": add_visit.drug_record,
            "heart_rate": add_visit.heart_rate,
            "diastolic_pressure": add_visit.diastolic_pressure, //舒张压
            "systolic_pressure": add_visit.systolic_pressure, //收缩压
            "blood_sugar": add_visit.blood_sugar, //血糖


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
                    add_visit.lock = false;
                    location.href = 'diag_visit.html';
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
                    add_visit.lock = false;

                }, 1500);
            }
        });


    },
    getDate: function() {
        Date.prototype.format = function(partten) {
            if (partten == null || partten == '') {
                partten = 'y-m-d';
            }
            var y = this.getFullYear();
            var m = this.getMonth() + 1;
            var d = this.getDate();
            var r = partten.replace(/y+/gi, y);
            r = r.replace(/m+/gi, (m < 10 ? "0" : "") + m);
            r = r.replace(/d+/gi, (d < 10 ? "0" : "") + d);
            return r;
        };
        //调用方式
        add_visit.date = (new Date()).format();



    },
    // textareaOnBlur: function(type) {
    //     if (type == 1) {
    //         add_visit.describe = add_visit.describe.replace(/\s/g, "");
    //     } else if (type == 2) {
    //         add_visit.guide = add_visit.guide.replace(/\s/g, "");
    //     } else if (type == 3) {
    //         add_visit.drug_record = add_visit.drug_record.replace(/\s/g, "");
    //     }

    // }, //textareaOnBlur
    textareaKeyup: function(type, num) {
        if (type == 1) {
            add_visit.count1 = add_visit.describe.length;
            if (add_visit.count1 >= num) {
                add_visit.count1 = num;
            }
        } else if (type == 2) {
            add_visit.count2 = add_visit.guide.length;
            if (add_visit.count2 >= num) {
                add_visit.count2 = num;
            }
        } else if (type == 3) {
            add_visit.count3 = add_visit.drug_record.length;
            if (add_visit.count3 >= num) {
                add_visit.count3 = num;
            }
        }

    }, //抬起手触发
    textareaInput: function(type, num) {
        if (type == 1) {
            add_visit.count1 = add_visit.describe.length;
            if (add_visit.count1 >= num) {
                add_visit.count1 = num;
            }
        } else if (type == 2) {
            add_visit.count2 = add_visit.guide.length;
            if (add_visit.count2 >= num) {
                add_visit.count2 = num;
            }
        } else if (type == 3) {
            add_visit.count3 = add_visit.drug_record.length;
            if (add_visit.count3 >= num) {
                add_visit.count3 = num;
            }
        }

    }, //抬起手触发

    textareaOnFocus: function() {},
});
$(function() {
    add_visit.init();
    if (add_visit.tab=="diag") {
        $toSelect.attr("href","selectPatient.html?tab=diag");
    }else{
        $toSelect.attr("href","selectPatient.html?tab=visit");
    }
});
