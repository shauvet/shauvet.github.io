/*自动生成表单*/

var formFactory = (function(){

    var formObj = {
        label: '名称',                    // 表单标签
        type: 'input',                   // 表单类型
        validator: function () {...},    // 表单验证规
        rules: '必填，长度为4-16个字符',    // 填写规则提示
        empty: '名称不能为空',            //验证为空
        success: '格式正确',              // 验证通过提示
        fail: '请按照格式要求填写'               // 验证失败提示
    };
    var labelObj = document.createElement('label');
    var labelText = document.createTextNode(formObj.label);
    labelObj.appendChild(labelText);
    var typeObj = document.createElement(formObj.type);

    var submit = document.createElement('input');
    submit.setAttribute('type','submit');
    submit.setAttribute('value','提交')

})();