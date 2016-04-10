(function(){
    var name = document.getElementById("name");
    var btn = document.getElementById("submit");
    var errBox = document.getElementById("errmsg");

    if(addEventListener){btn.addEventListener("click",validate,false)}
    else{btn.attachEvent("click",validate)}

    function validate(){

        var val = name.value;
        var flag = /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(val);
        var len = val.length;
        if(flag){len = len*2}
        if(len == 0){
            errBox.innerHTML = "姓名不能为空";
            errBox.style.color = "#a00";
        }
        else if(len < 4 || len > 16){
            errBox.innerHTML = "必填，长度为4~16个字符";
            errBox.style.color = "#a00";
        }
        else{
            errBox.innerHTML = "名称格式正确";
            errBox.style.color = "#0a0";
        }
    }
})();