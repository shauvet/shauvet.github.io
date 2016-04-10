(function(){
    var formWrapper = document.getElementsByClassName("form-wrapper")[0];
    var name = id("name");
    var pass = id("password");
    var repass = id("confirm");
    var email = id("email");
    var phone = id("cellphone");
    var btn = id("submit");

    if(addEventListener){btn.addEventListener("click",validateAll,false)}
    else{btn.attachEvent("click",validateAll)}

    function id(id){
        return document.getElementById(id);
    }

    function validateAll(){
        if(nameCheck()&&passCheck()&&repassCheck()&&emailCheck()&&phoneCheck()){
            alert("提交成功");
        }else{alert("提交失败");}
    }

    showTip(name,"必填，长度为4-16个字符");
    showTip(pass,"请输入4-6位字母或数字");
    showTip(repass,"两次输入相同密码");
    showTip(email,"请输入合法邮箱");
    showTip(phone,"请输入合法手机号");

    name.onblur = function(){check(name,"名称",nameCheck())};
    pass.onblur = function(){check(pass,"密码",passCheck())};
    repass.onblur = function(){check(repass,"确认密码",repassCheck())};
    email.onblur = function(){check(email,"邮箱",emailCheck())};
    phone.onblur = function(){check(phone,"手机",phoneCheck())};

//    提示
    function showTip(ele,msg){
        var tip = ele.nextElementSibling;
        ele.onfocus = function(){
            tip.innerHTML = msg;
            tip.style.color = "#ddd";
            ele.style.borderColor = "#00a";
        }
    }

//    为空验证
    function required(ele,name){
        var tip = ele.nextElementSibling;
        tip.innerHTML = name + "不能为空";
        tip.style.color = "#f00";
        ele.style.borderColor = "#f00";
    }

    function check(ele,name,func){
        var len = ele.value.length;
        if(len == 0){required(ele,name);}
        else{func()}
    }

    function nameCheck(){
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
    }
//验证密码
    function passCheck(){
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
    }
//验证确认密码
    function repassCheck(){
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
    }
//邮箱验证
    function emailCheck(){
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
    }
//手机验证
    function phoneCheck(){
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
})();