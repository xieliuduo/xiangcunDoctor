/**
 * Created by Cooper on 2014/11/7.
 * 工具类
 */


$(function () {
    //xs_utils.setReferrer();
    //xs_utils.setVisitor();
    //首页 index
    if(xs_utils.getPageName()=="index"||xs_utils.getPageName()=="login"){

    }else{
        xs_utils.isTokenOld();//判断token是否已经过期
    }
    window.addEventListener("offline", offline, false);
    window.addEventListener("online", online, false);
    //addcnzz();
    //alert(navigator.onLine);
    function offline() {
        layer.open({
            style: 'border:none; background-color:rgba(0,0,0,.9); color:#ffffff;',
            content: '网络不给力，请稍后重试',
        });
    }

    function online() {
        window.location.reload();
    }

    function addcnzz(){
        var scr = '<script src="https://s4.cnzz.com/z_stat.php?id=1260759112&web_id=1260759112" language="JavaScript"></script>';
        $("body").append(scr);
    }
});

function setCurrEnvironment(envFlag) {
    xs_utils.setCurrEnvironment(envFlag);

}

function authorize(uid, token, source) {
    if (isNum(uid) && token) {
        xs_utils._validate(uid, token);

    } else {
        xs_utils.removeLocalStorage("uid");
        xs_utils.removeLocalStorage("token");
    }
    if (source) {
        xs_utils.setCurrEnvironment(source);
    }
}
function isNum(s) {
    return /^[0-9]*$/.test(s);
}
function clearAllStorage() {
    xs_utils.clearLocalStorage();
    xs_utils.clearSessionStorage();
}

function onPageFinished() {
    var player = document.getElementById('really-cool-video');
    if (typeof player == "object") {

        player.play();

    }
}

var xs_utils = {
    //_api_url: "http://api.homedoctor.grdoc.org/",//正式
    _api_url: "http://siyuanfund.xieshoue.org/", //测试
    //_api_url: "http://api.homedoctor.exieshou.com/", //测试
    _forget_url: "http://sso.localhost.org/forget/callback",
    refreshTime: 10,//单位秒
    _do_not_back_url_key_word: ['reg', 'forget'],
    _back_to: "/profile/index",
    //与原生程序交互用
    _protocol: "observation&",
    _uid: 0,
    _visitor_id: 0,
    _token: null,
    _anonymous_token: '',
    mybridge: null,

    getApiUrl: function (method, params) {
        var params_str = "";
        if (typeof params == "object") {
            for (var i in params) {
                params_str += i.trim() + "=" + params[i] + "&";
            }
        }
        var return_url = this._api_url + method;
        if (params_str != '&') {
            return_url += "?" + params_str;
        }
        return return_url;
    },
    addParam: function (url, param) {
        
        if (typeof param == "string") {
            if (url.indexOf('?') == "-1") {
                return url + "?" + param;
            } else {
                return url + "&" + param;
            }
        }

    },
    getForgetUrl: function () {
        return this._forget_url;
    },
    //检查用户是否登录
    //forceLogin 是否强制登录 true
    checkIsLogged: function (forceLogin) {
        var token = xs_utils.getLocalStorage('syToken');
        if (token != null && token != "null") {
            this._token = token;
            return true;
        } else {
            if (forceLogin) {
                xs_utils.goLogin();
                // xs_utils.gotoPage( "login" );
            } else {
                return false;
            }
        }
    },
    // 检查是否需要刷新
    checkIsNeedRefresh: function (localTimeStamp) {
        if (typeof localTimeStamp != "undefined") {
            var timestamp = this.getTimeStamp();
            if (timestamp - localTimeStamp > this.refreshTime) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    },
    // 获取时间戳(和PHP的一样)
    getTimeStamp: function () {
        return parseInt(Date.parse(new Date()).toString().replace(/000/, ""));
    },
    // 检查页面是否滚到底
    checkDocumentIsScrollToBottom: function () {
        //var scrollTop = $( window ).scrollTop();
        var scrollTop = document.body.scrollTop | document.documentElement.scrollTop;
        var scrollHeight = $(document).height();

        var windowHeight = $(window).height();

        if (scrollTop + windowHeight >= scrollHeight - 50) {
            return true;
        }
        return false;
    },
    // 检查页面是否滚到顶部
    checkDocumentIsScrollToTop: function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop <= 50) {
            return true;
        }
        return false;
    },
    // 使用本地存储保存数据
    setLocalStorage: function (key, value) {
        localStorage.setItem(key, value);
    },
    // 移除本地存储的某一项
    removeLocalStorage: function (key) {
        localStorage.removeItem(key);
    },
    // 获取本地存储中的数据
    getLocalStorage: function (key) {
        return localStorage.getItem(key);
    },
    // 清除全部本地存储数据
    clearLocalStorage: function () {
        localStorage.clear();
    },
    // 使用本地session保存数据(关闭浏览器后失效)
    setSessionStorage: function (key, value) {
        sessionStorage.setItem(key, value);
    },
    // 移除本地session的某一项
    removeSessionStorage: function (key) {
        sessionStorage.removeItem(key);
    },
    // 获取本地session中的数据
    getSessionStorage: function (key) {
        return sessionStorage.getItem(key);
    },
    // 清除全部本地session数据
    clearSessionStorage: function () {
        sessionStorage.clear();
    },
    backPrevPage: function () {
        if (document.referrer != "") {
            window.location.href = document.referrer;
        }
    },
    /**
     * 跳转页面,只需要写页面名即可不用写文件扩展名
     * 参数1 : 页面名称 back() 后退
     * 参数2 : 参数对象 {"uid":1,"pid":2}
     */
    gotoPage: function () {
        var pageName = arguments[0] ? arguments[0] : null;
        var params = arguments[1] ? arguments[1] : null;
        if (pageName != "" && pageName != null) {
            if (pageName == "back()" || pageName == ":back()") {
                var referrer = this.getReferrer();
                var do_not_back_flag = false;
                for (var i in this._do_not_back_url_key_word) {
                    if (referrer.indexOf(this._do_not_back_url_key_word[i]) > 0) {
                        do_not_back_flag = true;
                        break;
                    }
                }
                if (do_not_back_flag) {
                    this.gotoPage(this._back_to);
                }

                if (pageName == "back()") {
                    window.history.back();
                } else if (pageName == ":back()") {
                    window.history.back();
                    window.parent.history.back();
                }
                return;
            }
            var params_str = "";
            if (params != null) {
                params_str = "?";
                if (typeof params == "object") {
                    for (var i in params) {
                        params_str += i.trim() + "=" + params[i] + "&";
                    }
                    params_str = params_str.substring(0, params_str.length - 1);
                }
            }
            var env_effect = true;
            if (pageName.indexOf("(") == 0 && pageName.lastIndexOf(")") > 0) {
                //不受环境变量影响
                env_effect = false;
                pageName = pageName.replace(/\(|\)/g, "");
            }

            if (xs_utils.getCurrEnvironment() == "ios" && env_effect) {
                var tUrl = this._protocol + pageName + '~' + this.getReferrer();
                //console.log(tUrl);
                xs_utils.loadURL(tUrl);
            } else if (xs_utils.getCurrEnvironment() == "android" && env_effect) {
                switch (pageName) {
                    case 'login':
                        window.UserOperation.login(this.getReferrer());
                        break;
                    case 'goProfile':
                        window.UserOperation.goProfile();
                        break;
                }
            }
        }
    },
    // 给应用传递参数 参数一:传递的内容 参数二:传递的方法名(安卓使用)
    executive: function (func, args) {
        if (xs_utils.getCurrEnvironment() == "ios") {
            var string = this._protocol + func;
            for (var i in args) {
                string += "~" + args[i];
            }
            xs_utils.loadURL(string);
        } else if (xs_utils.getCurrEnvironment() == "android") {
            var function_str = "window.VideoOperation." + func;
            function_str += "(";
            for (var i in args) {
                function_str += "'" + args[i] + "',";
            }
            console.log(function_str);
            function_str = function_str.substring(0, function_str.length - 1);
            function_str += ")";
            //console.log(function_str);
            eval(function_str);
        }
    },

    loadURL: function (url) {
        var iFrame;
        iFrame = document.createElement("iframe");
        iFrame.setAttribute("src", url);
        iFrame.setAttribute("style", "display:none;");
        iFrame.setAttribute("height", "0px");
        iFrame.setAttribute("width", "0px");
        iFrame.setAttribute("frameborder", "0");
        document.body.appendChild(iFrame);
        // 发起请求后这个iFrame就没用了，所以把它从dom上移除掉
        iFrame.parentNode.removeChild(iFrame);
        iFrame = null;
    },
    //获取url中指定参数
    getQueryParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    },
    //获取页面名称不带后缀
    getPageName: function () {
        var a = location.href;
        var b = a.split("/");
        var c = b.slice(b.length - 1, b.length).toString(String).split(".");
        return c.slice(0, 1).toString();
    },

    // 将数组转化为json格式字符串
    toJson: function (data) {
        // body...
        var json = [];
        for (var i in data) {
            var v = String(data[i]);
            v = v.replace(/['"]/ig, '“');
            var tmp = '"' + i + '":"' + v + '"';
            json.push(tmp);
        }
        ;
        return '{' + json.join(',') + '}';
    },
    //判断变量、数组、对象是否为空
    empty: function (v) {
        switch (typeof v) {
            case 'undefined' :
                return true;
            case 'string' :
                if (v.trim().length == 0) return true;
                break;
            case 'boolean' :
                if (!v) return true;
                break;
            case 'number' :
                if (0 === v) return true;
                break;
            case 'object' :
                if (null === v) return true;
                if (undefined !== v.length && v.length == 0) return true;
                for (var k in v) {
                    return false;
                }
                return true;
                break;
        }
        return false;
    },
    setReferrer: function () {
        var pageName = this.getPageName();
        if (!this.in_array(pageName, ['reg', 'login'])) {
            xs_utils.setSessionStorage('referrer', window.location.href);
        }
    },
    getReferrer: function () {
        return xs_utils.getSessionStorage('referrer');
    },
    setCurrEnvironment: function (envFlag) {
        if (envFlag) {
            xs_utils.setLocalStorage("CurrEnvironment", envFlag.toLowerCase());
        } else {
            xs_utils.setLocalStorage("CurrEnvironment", "");
        }
        xs_utils._anonymous_token = xs_utils.getLocalStorage("anonymous_token");

        if (!xs_utils._anonymous_token) {
            xs_utils._anonymous_token = xs_utils.randomString(10);
            xs_utils.setLocalStorage("anonymous_token", xs_utils._anonymous_token);
        }
    },
    getCurrEnvironment: function () {
        return xs_utils.getLocalStorage("CurrEnvironment");
    },
    // 授权验证
    validateAuthorize: function (uid, token) {
        var saved_uid = xs_utils.getLocalStorage('uid');
        var saved_token = xs_utils.setLocalStorage('token');
        if (uid != saved_uid || token != saved_token) {
            return false;
        }
        return true;
    },
    _validate: function (uid, token) {
        this._uid = uid;
        this._token = token;


        var url = xs_utils.getApiUrl("auth/test-token", {
            "uid": this._uid,
            "token": this._token,
        });

        $.ajax({
            type: "POST",
            url: url,
            async: false,
            success: function (ret) {
                if (ret.data) {
                    xs_utils.setLocalStorage('uid', ret.data.id);
                    xs_utils.setLocalStorage('token', token);
                }
            }
        });
    },
    // 判断字符串是否在数组中
    in_array: function (str, arr) {
        // body...
        var num = false;
        for (var k in arr) {
            if (arr[k] == str) {
                num = true;
            }
        }
        return num;
    },
    //参数为文本框id,不包含#
    loadDateControl: function () {
        var env = this.getCurrEnvironment();
        if (env != "ios") {
            var currYear = (new Date()).getFullYear();
            var opt = {};
            opt.date = {preset: 'date'};
            opt.default = {
                theme: "sense-ui",
                //theme: 'android-ics light', //皮肤样式
                display: 'modal', //显示方式
                mode: 'scroller', //日期选择模式
                lang: 'zh',
                setText: '确定',
                cancelText: '取消',
                dateOrder: 'yymmdd', //面板中日期排列格
                dateFormat: 'yyyy-mm-dd', // 日期格式
                dayText: '日',
                monthText: '月',
                yearText: '年', //面板中年月日文字
                endYear: currYear + 10 //结束年份
            };
            for (var i in arguments) {
                $("#" + arguments[i]).val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
            }
        } else {
            for (var i in arguments) {
                $("#" + arguments[i]).attr("type", "date");
            }
        }

    },
    checkCanLoadMore: function () {
        if ($("#img_loading").length < 1) {
            return true;
        }
        return false;
    },
    loadScript: function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" ||
                    script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others: Firefox, Safari, Chrome, and Opera 
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.body.appendChild(script);
    },
    randomString: function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    date: function (format, timestamp) {
        var ret;
        var a;
        var jsdate = new Date();
        if (timestamp) {
            jsdate.setYear(parseInt(timestamp.substring(0, 4), 10));
            jsdate.setMonth(parseInt(timestamp.substring(5, 7) - 1, 10));
            jsdate.setDate(parseInt(timestamp.substring(8, 10), 10));
            jsdate.setHours(parseInt(timestamp.substring(11, 13), 10));
            jsdate.setMinutes(parseInt(timestamp.substring(14, 16), 10));
            jsdate.setSeconds(parseInt(timestamp.substring(17, 19), 10));
        }
        var pad = function (n, c) {
            if ((n = n + "").length < c) {
                return new Array(++c - n.length).join("0") + n;
            } else {
                return n;
            }
        };
        var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var txt_ordin = {1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st"};
        var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var f = {
            // Day
            d: function () {
                return pad(f.j(), 2)
            },
            D: function () {
                return f.l().substr(0, 3)
            },
            j: function () {
                return jsdate.getDate()
            },
            l: function () {
                return txt_weekdays[f.w()]
            },
            N: function () {
                return f.w() + 1
            },
            S: function () {
                return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
            },
            w: function () {
                return jsdate.getDay()
            },
            z: function () {
                return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
            },

            // Week
            W: function () {
                var a = f.z(), b = 364 + f.L() - a;
                var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
                if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                    return 1;
                } else {
                    if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                        nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                        return date("W", Math.round(nd2.getTime() / 1000));
                    } else {
                        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                    }
                }
            },

            // Month
            F: function () {
                return txt_months[f.n()]
            },
            m: function () {
                return pad(f.n(), 2)
            },
            M: function () {
                return f.F().substr(0, 3)
            },
            n: function () {
                return jsdate.getMonth() + 1
            },
            t: function () {
                var n;
                if ((n = jsdate.getMonth() + 1) == 2) {
                    return 28 + f.L();
                } else {
                    if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                        return 31;
                    } else {
                        return 30;
                    }
                }
            },

            // Year
            L: function () {
                var y = f.Y();
                return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
            },
            //o not supported yet
            Y: function () {
                return jsdate.getFullYear()
            },
            y: function () {
                return (jsdate.getFullYear() + "").slice(2)
            },

            // Time
            a: function () {
                return jsdate.getHours() > 11 ? "pm" : "am"
            },
            A: function () {
                return f.a().toUpperCase()
            },
            B: function () {
                // peter paul koch:
                var off = (jsdate.getTimezoneOffset() + 60) * 60;
                var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
                var beat = Math.floor(theSeconds / 86.4);
                if (beat > 1000) beat -= 1000;
                if (beat < 0) beat += 1000;
                if ((String(beat)).length == 1) beat = "00" + beat;
                if ((String(beat)).length == 2) beat = "0" + beat;
                return beat;
            },
            g: function () {
                return jsdate.getHours() % 12 || 12
            },
            G: function () {
                return jsdate.getHours()
            },
            h: function () {
                return pad(f.g(), 2)
            },
            H: function () {
                return pad(jsdate.getHours(), 2)
            },
            i: function () {
                return pad(jsdate.getMinutes(), 2)
            },
            s: function () {
                return pad(jsdate.getSeconds(), 2)
            },
            //u not supported yet

            // Timezone
            //e not supported yet
            //I not supported yet
            O: function () {
                var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
                if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
                return t;
            },
            P: function () {
                var O = f.O();
                return (O.substr(0, 3) + ":" + O.substr(3, 2))
            },
            //T not supported yet
            //Z not supported yet

            // Full Date/Time
            c: function () {
                return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
            },
            //r not supported yet
            U: function () {
                return Math.round(jsdate.getTime() / 1000)
            }
        };

        return format.replace(/[\\]?([a-zA-Z])/g, function (t, s) {
            if (t != s) {
                // escaped
                ret = s;
            } else if (f[s]) {
                // a date function exists
                ret = f[s]();
            } else {
                // nothing special
                ret = s;
            }
            return ret;
        });
    },
    is_wechat: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    setVisitor: function () {
        var visitor_id = xs_utils.getLocalStorage('visitor_id');
        if (xs_utils.empty(visitor_id)) {
            var api_url = xs_utils.getApiUrl('visitor/add-visitor');
            $.ajax({
                url: api_url,
                type: "post",
                async: false,
                success: function (ret) {
                    console.log(ret)
                    if (ret.status_code == 200) {
                        this._visitor_id = ret.data.id;
                        xs_utils.setLocalStorage('visitor_id', ret.data.id);
                        xs_utils.setVisitorLog();
                    }
                },
                error: function (ret) {
                    alert(ret.message);
                }
            });
        } else {
            this._visitor_id = visitor_id;
            xs_utils.setVisitorLog();
        }
    },
    setVisitorLog: function () {
        //记录分享访问日志
        var share_visitor_id = xs_utils.getQueryParam("visitor_id");
        if (!xs_utils.empty(share_visitor_id)) {
            var api_url = xs_utils.getApiUrl('share/add-share-visit-logs');
            $.ajax({
                url: api_url,
                type: "post",
                async: false,
                data: {
                    share_visitor_id: share_visitor_id,
                    visitor_id: this._visitor_id,
                    url: window.location.href
                },
                success: function (ret) {
                    console.log(ret)
                },
                error: function (ret) {
                    alert(ret.message);
                }
            });
        }
    },
    //原生登录
    goLogin: function () {
        xs_utils.connectWebViewJavascriptBridge(function (bridge) {
            xs_utils.mybridge = bridge;
        });
        var data = {}; //参数为任意值，默认即可
        var u = navigator.userAgent; //用于判断手机类型
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        // window.location.href = "login.html";

        if (!isiOS) {
            WebCall.login();
            //var andToken = WebCall.getToken();
            //xs_utils.setLocalStorage("syToken", WebCall.getToken());
            // alert(andToken);
            // window.location = "index.html?token="+WebCall.getToken();
        } else {
            //调用苹果登录方法
            xs_utils.mybridge.callHandler('Login', data, function (response) {});
        }
    },
    //滚动
    goscrollEnabled: function () {
        xs_utils.connectWebViewJavascriptBridge(function (bridge) {
            xs_utils.mybridge = bridge;
        });
        var data = {}; //参数为任意值，默认即可
        var u = navigator.userAgent; //用于判断手机类型
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (!isiOS) {
            
        } else {
            //调用苹果滚动方法
        xs_utils.mybridge.callHandler('goscrollEnabled', data, function (response) {});
            
        }
    },
    //禁止滚动
    goscrollNotEnabled: function () {
        xs_utils.connectWebViewJavascriptBridge(function (bridge) {
            xs_utils.mybridge = bridge;
        });
        var data = {}; //参数为任意值，默认即可
        var u = navigator.userAgent; //用于判断手机类型
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (!isiOS) {
            return true;
        } else {
            //调用苹果禁止滚动方法
            xs_utils.mybridge.callHandler('goscrollNotEnabled', data, function (response) {});
           
        }
    },
    exitApp: function () {
        xs_utils.connectWebViewJavascriptBridge(function (bridge) {
            xs_utils.mybridge = bridge;
        });
        var data = {}; //参数为任意值，默认即可
        var u = navigator.userAgent; //用于判断手机类型
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (!isiOS) {
            WebCall.clearToken();
            xs_utils.removeLocalStorage("syToken");
            //window.location = "user_center.html";
        } else {
            console.log("苹果退出登录");
            xs_utils.mybridge.callHandler('QuitLogin', data, function (response) {});
            xs_utils.removeLocalStorage("syToken");
        }
    },
    connectWebViewJavascriptBridge: function (callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                callback(WebViewJavascriptBridge)
            }, false);
        }
    },
    nextPage:function(url){
         if (url.indexOf('page') == "-1") {
                return xs_utils.addParam(url,"page=2")
        } else {
           var reg = /page=(\d)/g;
           var page=reg.exec(url)[1];
           var next_page = 'page=' + (parseInt(page)+1);
           return  url.replace( reg,next_page);
        }
    },
    //判断是否是ios
    isiOS:function(){
        var u = navigator.userAgent; //用于判断手机类型
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (!isiOS) {
            return false;
        } else {
            return true;
        }
    },
    //判断token是否过期
    isTokenOld:function(){
        var token = xs_utils.getLocalStorage("syToken");
        var url = xs_utils.getApiUrl("/api/check-token", {
            "token":token
        });
        $.get(url, function(ret) {
            if(ret.status_code=="403"){
                //如果已经过期则重新登录
                xs_utils.quitLogin();
            }else{
                console.log("没有过期");
            }
        });
    },
    //token过期重新登录
    quitLogin: function () {
        xs_utils.connectWebViewJavascriptBridge(function (bridge) {
            xs_utils.mybridge = bridge;
        });
        var data = {}; //参数为任意值，默认即可
        var u = navigator.userAgent; //用于判断手机类型
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (!isiOS) {
            console.log("安卓重新登录");
            xs_utils.clearLocalStorage();
            Quit.Quit();
        } else {
            console.log("苹果重新登录");
            xs_utils.clearLocalStorage();
            xs_utils.mybridge.callHandler('QuitLogin', data, function (response) {});
        }
    },

};
