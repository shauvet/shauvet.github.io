/*生成表单*/

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

/*检查方法*/
var check = (function(){
    var nameMsg = ['名称不能为空','名称不能包含除中文、英文、数字以外的字符','请输入4-16位字符','名称可用'];
    var passwordMsg = ['密码不能为空','密码不能包含英文字母及数字以外的字符','请输入6-8位字符','密码可用'];
    var confirmMsg = ['重复密码不能为空','两次密码输入不一致','密码可用'];
    var emailMsg = ['邮箱不能为空','邮箱格式不正确','邮箱可用'];
    var phoneMsg = ['手机号不能为空','手机号格式不正确','手机号可用'];
    var curPassword = '';
    var passFlag = false;
    return {
        nameCheck:function(str){
            var count = 0,i;
            var chnRe = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
            var re = /[^0-9a-z\u4E00-\u9FA5\uF900-\uFA2D]/i;
            if(str == ''){return nameMsg[0];}
            else if(re.test(str)){return nameMsg[1];}
            else{
                for(i=0; i<str.length; i++){
                    if(chnRe.test(str[i])){count+=2}
                    else{count++}
                }
                if(count < 4 || count > 16){return nameMsg[2]}
            }
            return nameMsg[3];
        },
        passCheck:function(str){
            var re = /^[0-9a-z]*$/i;
            var len = str.length;
            if(str == ''){return passwordMsg[0];}
            else if(!re.test(str)){return passwordMsg[1];}
            else if(len < 6 || len > 8){return passwordMsg[2];}
            else{
                passFlag = true;
                curPassword = str;
                return passwordMsg[3];
            }
        },
        confirmCheck:function(str){
            if(str == ''){return confirmMsg[0]}
            else if(passFlag){
                if(curPassword !== str){return confirmMsg[1]}
                else{return confirmMsg[2]}
            }
        },
        emailCheck:function(str){
            var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
            if(str == ''){return emailMsg[0]}
            else if(re.test(str)){return emailMsg[1]}
            else{return emailMsg[2]}
        },
        phoneCheck:function(str){
            var re = /^1[3|4|5|7|8]\d{9}$/;
            if(str == ''){return phoneMsg[0]}
            else if(re.test(str)){return phoneMsg[1]}
            else{return phoneMsg[2]}
        }
    };
})();

/*表单工厂*/
function FormList(label,type,rules,validator){
    this.label = label;
    this.type = type;
    this.rules = rules;
    this.validator = validator;
}

/*实例化*/
var nameObj = new FormList('名称','input','必填，长度为4-16个字符',check.nameCheck);
var passwordObj = new FormList('密码','password','必填，长度为6-8个字符',check.passCheck);
var confirmObj = new FormList('确认密码','password','必填，与密码相同',check.confirmCheck);
var emailObj = new FormList('邮箱','email','必填，请输入邮箱',check.emailCheck);
var phoneObj = new FormList('手机','telephone','必填，请输入手机号',check.phoneCheck);
var labelObj = {//中英文转换
    '名称':'name',
    '密码':'password',
    '确认密码':'confirm',
    '邮箱':'email',
    '手机':'phone'
};

function toString(obj){
    return '<label for="' + labelObj[obj.label] + '">' + obj.label + '</label><input type="' + obj.type + '" placeholder="请输入' + obj.label + '" id="' + labelObj[obj.label] + '" name="' + labelObj[obj.label] + '" /><p id="'+ labelObj[obj.label] +'Tip"></p>';
}

readyEvent(formFactory);
//工厂实现
function formFactory(){
    var formShow = $('formShow');

    var nameCre = $('nameCre');
    var passwordCre = $('passwordCre');
    var emailCre = $('emailCre');
    var phoneCre = $('phoneCre');
    var style1 = $('style1');
    var style2 = $('style2');

    var formCre = $('formCreate');

    var strObj = {
        0:[nameObj],
        1:[passwordObj,confirmObj],
        2:[emailObj],
        3:[phoneObj]
    };
    addEvent(formCre,'click',createForm);
    function createForm(){
        var creArr = [nameCre,passwordCre,emailCre,phoneCre];
        var str = '',choseArr = [], i,j,k;
        for(i=0; i<creArr.length; i++){
            if(creArr[i].checked){choseArr.push(strObj[i])}
        }
        for(j=0; j<choseArr.length; j++){
            for(k=0; k<choseArr[j].length; k++){
                str += toString(choseArr[j][k]);
            }
        }
        if(style1.checked){formShow.className = 'style1'}
        else if(style2.checked){formShow.className = 'style2'}
        str += '<input type="button" value="提交" id="submit" />'
        formShow.innerHTML = str;
        (function(){
            var name = $('name');
            var nameTip = $('nameTip');
            var password = $('password');
            var passwordTip = $('passwordTip');
            var confirm = $('confirm');
            var confirmTip = $('confirmTip');
            var email = $('email');
            var emailTip = $('emailTip');
            var phone = $('phone');
            var phoneTip = $('phoneTip');
            var submit = $('submit');

            name&&addEvent(name,'focus',function(){
                name.className = 'normal';
                nameTip.innerHTML = nameObj.rules;
            });
            name&&addEvent(name,'blur',function(){
                nameTip.innerHTML = check.nameCheck(name.value);
                if(nameTip.innerHTML == '名称可用'){
                    name.className = 'right';
                    nameTip.style.color = '#5fb844';
                }else{
                    name.className = 'wrong';
                    nameTip.style.color = '#de0011';
                }
            });

            password&&addEvent(password,'focus',function(){
                password.className = 'normal';
                passwordTip.innerHTML = passwordObj.rules;
            });
            password&&addEvent(password,'blur',function(){
                passwordTip.innerHTML = check.passCheck(password.value);
                if(passwordTip.innerHTML == '密码可用'){
                    password.className = 'right';
                    passwordTip.style.color = '#5fb844';
                }else{
                    password.className = 'wrong';
                    passwordTip.style.color = '#de0011';
                }
            });

            confirm&&addEvent(confirm,'focus',function(){
                confirm.className = 'normal';
                confirmTip.innerHTML = confirmObj.rules;
            });
            confirm&&addEvent(confirm,'blur',function(){
                confirmTip.innerHTML = check.confirmCheck(confirm.value);
                if(confirmTip.innerHTML == '密码可用'){
                    confirm.className = 'right';
                    confirmTip.style.color = '#5fb844';
                }else{
                    confirm.className = 'wrong';
                    confirmTip.style.color = '#de0011';
                }
            });

            email&&addEvent(email,'focus',function(){
                email.className = 'normal';
                emailTip.innerHTML = nameObj.rules;
            });
            email&&addEvent(email,'blur',function(){
                emailTip.innerHTML = check.emailCheck(email.value);
                if(emailTip.innerHTML == '邮箱可用'){
                    email.className = 'right';
                    emailTip.style.color = '#5fb844';
                }else{
                    email.className = 'wrong';
                    emailTip.style.color = '#de0011';
                }
            });

            phone&&addEvent(phone,'focus',function(){
                phone.className = 'normal';
                phoneTip.innerHTML = phoneObj.rules;
            });
            phone&&addEvent(phone,'blur',function(){
                phoneTip.innerHTML = check.phoneCheck(phone.value);
                if(phoneTip.innerHTML == '手机号可用'){
                    phone.className = 'right';
                    phoneTip.style.color = '#5fb844';
                }else{
                    phone.className = 'wrong';
                    phoneTip.style.color = '#de0011';
                }
            });
        })();
    }
};