/*生成表单*/

var formFactory = (function(){

    /*common tools*/
    function $(id){
        return document.getElementById(id);
    }
    // 页面加载完成后
     function readyEvent(fn) {
        if (fn==null) {
            fn=document;
        }
        var oldonload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = fn;
        } else {
            window.onload = function() {
                oldonload();
                fn();
            };
        }
    }
    // 视能力分别使用dom0||dom2||IE方式 来绑定事件
    // 参数： 操作的元素,事件名称 ,事件处理程序
     function addEvent(element, type, handler) {
        if (element.addEventListener) {
            //事件类型、需要执行的函数、是否捕捉
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, function() {
                handler.call(element);
            });
        } else {
            element['on' + type] = handler;
        }
    }
    // 移除事件
     function removeEvent(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.datachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    }


    /*检查方法*/
    var check = (function(){
        return {
            nameCheck:function(){
                var val = name.value;
                var re = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
                var len = val.length;
                var tip = name.nextElementSibling;
                if(re.test(val)){len = len*2}
                if(len < 4 || len > 16){
                    tip.innerHTML = "必填，长度为4~16个字符";
                    tip.style.color = "#f00";
                    name.style.borderColor = "#f00";
                }
                else{
                    tip.innerHTML = "名称格式正确";
                    tip.style.color = "#0a0";
                    name.style.borderColor = "#0a0";
                    return true;
                }
                return false;
            },
            passCheck:function(){
                var val = pass.value;
                var re = /^[0-9a-zA-Z]*$/;
                var len = val.length;
                var tip = pass.nextElementSibling;
                if(!re.test(val)){
                    tip.innerHTML = "请输入字母或数字";
                    tip.style.color = "#f00";
                    pass.style.borderColor = "#f00";
                }else if(len <4 || len > 16){
                    tip.innerHTML = "必填，长度为4~16个字符";
                    tip.style.color = "#f00";
                    pass.style.borderColor = "#f00";
                }
                else{
                    tip.innerHTML = "密码可用";
                    tip.style.color = "#0a0";
                    pass.style.borderColor = "#0a0";
                    return true;
                }
                return false;
            },
            confirm:function(){
                var val1 = pass.value;
                var val2 = repass.value;
                var tip = repass.nextElementSibling;
                if(val1 == val2){
                    tip.innerHTML = "密码输入一致";
                    tip.style.color = "#0a0";
                    repass.style.borderColor = "#0a0";
                    return true;
                }
                else{
                    tip.innerHTML = "两次输入密码不一致";
                    tip.style.color = "#f00";
                    repass.style.borderColor = "#f00";
                }
                return false;
            },
            emailCheck:function(){
                var val = email.value;
                var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                var tip = email.nextElementSibling;
                if(!re.test(val)){
                    tip.innerHTML = "邮箱格式错误";
                    tip.style.color = "#f00";
                    email.style.borderColor = "#f00";
                    return false;
                }else{
                    tip.innerHTML = "邮箱格式正确";
                    tip.style.color = "#0a0";
                    email.style.borderColor = "#0a0";
                    return true;
                }
            },
            phoneCheck:function(){
                var val = phone.value;
                var re = /^1[3|4|5|7|8]\d{9}$/;
                var tip = phone.nextElementSibling;
                if(!re.test(val)){
                    tip.innerHTML = "手机格式错误";
                    tip.style.color = "#f00";
                    phone.style.borderColor = "#f00";
                    return false;
                }else{
                    tip.innerHTML = "手机格式正确";
                    tip.style.color = "#0a0";
                    phone.style.borderColor = "#0a0";
                    return true;
                }
            }
        };

    })();

    var nameCre = $('name');
    var passwordCre = $('password');
    var emailCre = $('email');
    var phoneCre = $('phone');

    var formCre = $('formCreate');

    /*表单工厂*/
    function FormList(label,type,rules,validator){
        this.label = label;
        this.type = type;
        this.rules = rules;
        this.validator = validator;

    }

    /*实例化*/
    var name = new FormList('名称','input','必填，长度为4-16个字符',check.nameCheck);
    var password = new FormList('密码','password','必填，长度为6-8个字符',check.passCheck);
    var confirm = new FormList('确认密码','password','与密码相同',check.confirm);
    var email = new FormList('邮箱','email','请输入邮箱',check.emailCheck);
    var phone = new FormList('手机','telephone','请输入手机号',check.phoneCheck);

})();