/**
 * Created by yang8 on 2016/4/23.
 */
var modalCtrl = (function(){
    var mask = document.querySelector('.mask');
    var modal = document.querySelector('.modal');
    var closeBtn = modal.querySelector('.close');
    var modalHeader = modal.querySelector('h6');
    var modalCtrlBtn = document.getElementById('modal-ctrl-btn');

    function addEvent(ele,type,func){
        if(ele.addEventListener){
            ele.addEventListener(type,func,false);
        }else if(ele.attachEvent){
            ele.attachEvent(type,func);
        }else{
            ele['on' + type] = func;
        }
    }
    function hide(){
        mask.style.display = 'none';
        modal.style.display = 'none';
    }
    function show(){
        mask.style.display = 'block';
        modal.style.display = 'block';
    }

    function drag(e){
        var disX,disY;
        e = e || window.event;
        disX = e.clientX - modal.offsetLeft;
        disY = e.clientY - modal.offsetTop;

        document.onmousemove = function(e){
            e = e || window.event;
            modal.style.left = e.clientX + 200 - disX + 'px';
            modal.style.top = e.clientY + 150 - disY + 'px';
        };
        document.onmouseup = function(){
            document.onmousedown = null;
            document.onmousemove = null;
        }
    }
    addEvent(mask,'click',hide);
    addEvent(modalCtrlBtn,'click',show);
    addEvent(closeBtn,'click',hide);
    addEvent(modalHeader,'mousedown',drag);
})();