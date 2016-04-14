/**
 * Created by yang8 on 2016/4/1.
 */
var switch1 = (function(){
    /*切换在校否*/
    var divs = document.getElementsByClassName('org');
    var student = document.getElementById('student');
    var society = document.getElementById('society');

    student.onclick = function(){
        divs[0].style.display = 'block';divs[1].style.display = 'none';
    };
    society.onclick = function(){
        divs[1].style.display = 'block';divs[0].style.display = 'none';
    };
})();
var switch2 = (function(){
    /*切换城市*/
    var data = {
        bj:['北京大学','清华大学'],
        sh:['复旦大学','同济大学'],
        hz:['浙江大学','中国美院']
    };
    var city = document.getElementById('city');
    var uni = document.getElementById('uni');

    city.addEventListener('change',function(){
        var selected = city.options[city.selectedIndex].value;
        uni.innerHTML = '';
        for(var i=0; i<data[selected].length; i++){
            uni.options.add(new Option(data[selected][i]));
        }
    },false);
})();
