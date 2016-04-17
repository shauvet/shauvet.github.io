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

    var nameCre = $('name');
    var passwordCre = $('password');
    var emailCre = $('email');
    var phoneCre = $('phone');

    var formCre = $('formCreate')

    function FormList(label,type,rules,validator){
        this.label = label;
        this.type = type;
        this.rules = rules;
        this.validator = validator;

    }

})();