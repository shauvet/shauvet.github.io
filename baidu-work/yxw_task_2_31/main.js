/**
 * Created by yang8 on 2016/4/1.
 */
(function(){
    var divs = document.getElementsByClassName("org");
    var student = document.getElementById("student");
    var society = document.getElementById("society");

    student.onclick = function(){
        divs[0].style.display = "block";divs[1].style.display = "none";
    };
    society.onclick = function(){
        divs[1].style.display = "block";divs[0].style.display = "none";
    }

})();