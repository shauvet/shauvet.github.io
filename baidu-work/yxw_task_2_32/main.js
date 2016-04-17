/*生成表单*/

var formFactory = (function(){
    var formObj = {
        label: '名称',                    // 表单标签
        type: 'input',                   // 表单类型
//        validator: function () {...},    // 表单验证规
        rules: '必填，长度为4-16个字符',    // 填写规则提示
        empty: '名称不能为空',            //验证为空
        success: '格式正确',              // 验证通过提示
        fail: '请按照格式要求填写'               // 验证失败提示
    };
    /*common tools*/
    function $(id){
        return document.getElementById(id);
    }
    function addEvent(type,func){
        if(addEventListener){
            return addEventListener(type,func,false);
        }else{
            return attachEvent(type,func);
        }
    }

    /*检查方法*/
    var check = (function(){
        return {
            nameCheck:function(){},
            passCheck:function(){},
            repassCheck:function(){},
            emailCheck:function(){},
            phoneCheck:function(){}
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

    var name = new FormList('名称','input','必填，长度为4-16个字符',nameCheck);
    var password = new FormList('密码','password','必填，长度为6-8个字符',passCheck);
    var rePassword = new FormList('确认密码','password','与密码相同',repassCheck);
    var email = new FormList('邮箱','email','请输入邮箱',emailCheck);
    var phone = new FormList('手机','telephone','请输入手机号',phoneCheck);

})();