/*
* 2016.4
* shauvet(bzhyang@126.com)
*/

var EDU = (function(){

    /*common tools*/
    function hasClass(el,className){
        if(el.classList){
            return el.classList.contains(className);
        }else{
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    }

    function addClass(el,className){
        if(el.classList){
            el.classList.add(className);
        }else if(!hasClass(el,className)){
            el.className += " " + className;
        }
    }

    function removeClass(el,className){
        if(el.classList){
            el.classList.remove(className);
        }else if(hasClass(el,className)){
            var reg = new RegExp('(\\s|^)' + className + '(\\|$)');
            el.className = el.className.replace(reg,"");
        }
    }

    function setCookie(c_name,value,expiredays){
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    }

    function getCookie(c_name){
        if(document.cookie.length > 0){
            c_start = document.cookie.indexOf(c_name + "=");
            if(c_start != -1){
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";",c_start);
                if(c_end == -1){c_end = document.cookie.length}
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    }

    function deleteCookie(c_name){
        setCookie(c_name,"",new Date(0));
    }

    function ajax(url, options) {
        var xhr = new XMLHttpRequest();
        var method, queryString = '', requestURL = url;//requestURL是供GET方法时使用
        var keyValuePairs = [];
        var i, lenOfKeyvaluepairs;

        requestURL += (requestURL.indexOf('?') == -1 ? '?' : '&');
        method = options.type ? options.type : 'get';

        //处理传入的参数，编码并拼接
        if (options.data) {
            if (typeof options.data == 'string') {
                queryString = options.data;
                requestURL += queryString;
            }
            else {
                for (var p in options.data) {
                    if (options.data.hasOwnProperty(p)) {
                        var key = encodeURIComponent(p);
                        var value = encodeURIComponent(options.data[p]);
                        keyValuePairs.push(key + '=' + value);
                    }
                }
                lenOfKeyvaluepairs = keyValuePairs.length;
                queryString = keyValuePairs.join('&');
                requestURL += queryString;
            }
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    options.onsuccess(xhr);
                }
                else {
                    if (options.onfail) {
                        options.onfail();
                    }
                    else {
                        alert('Sorry,your request is unsuccessful:' + xhr.statusText);
                    }
                }
            }
        };
        if (method == 'get') {
            xhr.open(method, requestURL, true);
            xhr.send(null);
        }
        else {
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(queryString);
        }
    }

    function fadein(el){
        el.style.display = "";
        el.style.opacity = 0;
        var last = +new Date();
        var tic = function(){
            el.style.opacity = +el.style.opacity + (new Date() - last)/1000;
            last = +new Date();
            if(+el.style.opacity < 1){
                (window.requestAnimationFrame&&requestAnimationFrame(tic) || setTimeout(tic, 16));
            }
        };
        tic();
    }

    function fadeout(el){
        el.style.display = "";
        el.style.opacity = 1;
        var last = +new Date();
        var tic = function(){
            el.style.opacity = +el.style.opacity - (new Date() - last)/1000;
            last = +new Date();
            if(+el.style.opacity > 0){
                (window.requestAnimationFrame&&requestAnimationFrame(tic) || setTimeout(tic, 16));
            }
        };
        tic();
    }
//轮播图高度自适应
    function carouselImgFix(){
        var carouselWrapper = document.querySelector('.carousel-area');
        var bannerWrapper = document.querySelector(".banner-wrapper");
        var carouselImg = bannerWrapper.querySelector('img');
        var rightHeight = window.getComputedStyle(carouselImg, null).getPropertyValue('height');
        carouselWrapper.style.height = rightHeight;
    }

    function getCurIndex(eles,className){
        var curIndex;
        for(var i=0; i<eles.length; i++){
            if(hasClass(eles[i],className)){
                curIndex = i;
            }
        }
        return curIndex;
    }

    /*
    * 参数说明
    * startPageIndex: 第一个li.page的页数
    * totalPage： 课程列表总页数
    * curItemIndex： 当前页面索引
    * size： 分页按钮数量
    * */

    function creatPageNav(startPageIndex, totalPage, curItemIndex, size){
        var pageNav = document.querySelector(".page-nav");
        var lastPageBtn = "<li class='last-page'><</li>";
        var nextPageBtn = "<li class='next-page'>></li>";
        var pageBtns = "";
        var len = size, i,lastPageIndex;
        if(startPageIndex !== 1 || curItemIndex !== 0){
            pageBtns += lastPageBtn;
        }
        for(i=0; i<len; i++){
            var pageIndexValue = startPageIndex + i;
            if(i == len-1){
                lastPageIndex = pageIndexValue;
            }
            pageBtns += "<li class='page' data-index='"+ i +"'>" + pageIndexValue + "</li>"
        }
        if(lastPageIndex !== totalPage-1 || curItemIndex != size-1){
            pageBtns += nextPageBtn;
        }
        pageNav.innerHTML = pageBtns;
        addClass(pageNav.querySelectorAll(".page")[curItemIndex], "selected");
    }

    /*
    * courseType： 课程类型
    * pageNo: 请求页数
    * pageSize: 每页的数据个数
    * startPageIndex: 第一个li.page的页数
    * curPageIndex: 可选，动态生成分页导航处于选中状态的按钮
    * */

    function loadCourses(courseType, pageNo, pageSize, startPageIndex, curPageIndex){
        var ajaxSuccess = function(xhr){
            var coursesArea = document.querySelector(".item-list");
            var lenOfPages,sizeOfPages;
            var courseItem = "";
            var courses = JSON.parse(xhr.responseText);
            var lenOfCourses = 20;
            for(var i=0; i<lenOfCourses; i++){
                var imgUrl = courses.list[i].bigPhotoUrl;
                var name = courses.list[i].name;
                var author = courses.list[i].provider;
                var learnerNum = courses.list[i].learnerCount;
                var price = courses.list[i].price;
                courseItem += "<div class='item'><img src='"+ imgUrl +"' alt=''/><h6 class='item-title'>" + name + "</h6><p class='author'>"+ author +"</p><div class='stu-number'><i></i><span>" + learnerNum + "</span></div><p class='price'>" + "¥ " + price + "</p></div>";
            }
            coursesArea.innerHTML = courseItem;
            lenOfPages = courses.pagination.totlePageCount;
            sizeOfPages = lenOfPages < 8 ? lenOfPages : 8;

            var curIndex;
            if(typeof curPageIndex != "undefined"){
                curIndex = curPageIndex;
            }else{
                curIndex = pageNo-1;
            }

            creatPageNav(startPageIndex, lenOfPages, curIndex, sizeOfPages);
        };
        var url = "http://study.163.com/webDev/couresByCategory.htm";
        var options = {
            data: {
                pageNo: pageNo,
                psize: pageSize,
                type: courseType
            },
            onsuccess: ajaxSuccess
        };
        ajax(url, options);
    }

    /*common tools end*/

    /*处理轮播图高度变化问题*/
    carouselImgFix();
    window.addEventListener("resize",carouselImgFix,false);

    loadCourses(10,1,20,1);

    /*不再提醒*/
    var noMoreTip = (function(){
        var noticeArea = document.querySelector(".notice-area");
        var noticeCloseBtn = noticeArea.querySelector("span");
        noticeCloseBtn.addEventListener("click",function(){
            noticeArea.style.display = "none";
            setCookie("notice","none",1);
        });
        if(getCookie("notice") == "none"){
            noticeArea.style.display = "none";
        }
    })();

    /*关注与登录*/
    var followLogin = (function(){
        var navArea = document.querySelector(".nav-area");
        var followWrap = navArea.querySelector(".follow-wrapper");
        var followBtn = navArea.querySelector(".follow-btn");
        var followedBtn = navArea.querySelector(".followed-btn");
        var followedFans = navArea.querySelector(".followed-fans");
        var cancelFollow = navArea.querySelector(".followed-cancel");
        var loginMask = document.querySelector(".login-m");
        var loginCloseBtn = loginMask.querySelector(".close-btn-big");
        var loginBtn = loginMask.querySelector("span");

        followBtn.addEventListener("click", function () {
            loginMask.style.display = "block";
        });
        cancelFollow.addEventListener("click",function(){
            var fansNum = parseInt(followedFans.innerHTML);
            followedBtn.style.display = "none";
            followBtn.style.display = "inline-block";
            followedFans.innerHTML = fansNum-1;
            setCookie("follow","false");
        });
        loginCloseBtn.addEventListener("click",function(){
            loginMask.style.display = "none";
        });
        loginBtn.addEventListener("click",loginValidate);

        function followEdu(){
            var ajaxSuccess = function(xhr){
                var fansNum = parseInt(followedFans.innerHTML);
                var state = xhr.responseText;
                if(state == 1){
                    setCookie("followSuc","true",1);
                    followBtn.style.display = "none";
                    followedBtn.style.display = "inline-block";
                    followedFans.innerHTML = fansNum+1;
                    alert("关注成功");
                }else{
                    alert("关注失败");
                }
            };
            var url = "http://study.163.com/webDev/attention.htm";
            var options = {
                onsuccess:ajaxSuccess
            };
            ajax(url,options);
        }
        if(getCookie("followSuc") == "true"){
            followBtn.style.display = "none";
            followedBtn.style.display = "inline-block";
        }

        function loginValidate(){
            var account = document.getElementById("account").value;
            var password = document.getElementById("password").value;
            account = account.trim();
            password = password.trim();
            if(!account || !password){
                alert("请完整填写！");
            }
            var ajaxSuccess = function(xhr){
                var state = xhr.responseText;
                if(state == 1){
                    setCookie("login","success",1);
                    loginMask.style.display = "none";
                    alert("登陆成功");
                    followEdu();
                }else{
                    alert("用户名或密码错误！");
                }
            };
            var url = "http://study.163.com/webDev/login.htm";
            var options = {
                data: {
                    userName: md5(account),
                    password: md5(password)
                },
                onsuccess: ajaxSuccess
            };
            ajax(url, options);
        }

    })();

    /*轮播图*/
    var carousel = (function(){
        var banners = document.querySelectorAll(".banner");
        var indicators = document.querySelectorAll(".carousel-indicators");
        var indiWrapper = document.querySelector(".indicator-wrapper");
        var carouselArea = document.querySelector(".carousel-area");

        function showPic(curIndex,tarIndex){
            removeClass(banners[curIndex],"selected-banner");
            fadeout(banners[curIndex]);
            removeClass(indicators[curIndex],"on");
            addClass(banners[tarIndex],"selected-banner");
            fadein(banners[tarIndex]);
            addClass(indicators[tarIndex],"on");
        }
//  手动切换图片
        indiWrapper.addEventListener("click",function(e){
            if(e.target.tagName == 'LI'){
                var curIndex = getCurIndex(banners,"selected-banner");
                var tarIndex = parseInt(e.target.getAttribute("data-slide-to"));
                showPic(curIndex,tarIndex);
            }
        });
//  自动切换
        function autoSlide(){
            var curIndex = getCurIndex(banners,"selected-banner");
            var tarIndex = 0;
            if(curIndex == banners.length-1){
                tarIndex = 0;
            }else{
                tarIndex = curIndex+1;
            }
            showPic(curIndex,tarIndex);
        }
        var timer = setInterval(autoSlide,5000);
        var flag = false;//鼠标是否进入轮播图
        carouselArea.onmouseenter = function(){
            clearInterval(timer);
            flag = true;
        };
        carouselArea.onmouseleave = function(){
            timer = setInterval(autoSlide,5000);
            flag = false;
        };
    })();

    /*Tab分页课程表*/
    var tabNav = (function(){
        var tabCtrl = document.querySelector(".tab-ctrl");
        var lis = tabCtrl.querySelectorAll("li");
        var len = lis.length;
        tabCtrl.addEventListener("click",function(e){
            var curTabIndex = getCurIndex(lis,"selected");
            var type;
            for(var i=0; i<len; i++){
                if(lis[i].contains(e.target)) {
                    if (curTabIndex == i) {
                        break;
                    }
                    else {
                        type = parseInt(lis[i].getAttribute("data-type"));
                        loadCourses(type,1,20,1);
                        removeClass(lis[curTabIndex], "selected");
                        addClass(lis[i], "selected");
                    }
                }}
        },false);
    })();

    /*分页处理*/
    var pagination = (function (){
        var pageNav = document.querySelector(".page-nav");
        pageNav.addEventListener("click",function(e){
            var targetIndex;
            var pages = pageNav.querySelectorAll(".page");
            var tabs = document.querySelectorAll(".tab-btn");
            var curPageIndex = getCurIndex(pages,"selected");
            var curTabIndex = getCurIndex(tabs,"selected");
            var curType = parseInt(tabs[curTabIndex].getAttribute("data-type"));
            var startPageIndex = parseInt(pages[0].innerHTML);
            var endPageIndex = parseInt(pages[pages.length-1].innerHTML);

            if(e.target.className == "page"){
                targetIndex = parseInt(e.target.getAttribute("data-index"));
                loadCourses(curType,targetIndex+1,20,startPageIndex);
            }else if(e.target.className == "last-page"){
                if(curPageIndex > 0){
                    loadCourses(curType,curPageIndex,20,startPageIndex);
                }else if(curPageIndex == 0){
                    if(startPageIndex == 3){
                        loadCourses(curType,2,20,1,1);
                    }else{
                        loadCourses(curType,startPageIndex-1,20,startPageIndex-pages.length,pages.length-1);
                    }
                }else return;
            }else if(e.target.className == "next-page"){
                if(curPageIndex < pages.length-1){
                    loadCourses(curType,curPageIndex+2,20,startPageIndex);
                }else if(curPageIndex == pages.length-1){
                    var endValue = 24;//这里应该用ajax取后台totalPageCount%size的
                    if(endPageIndex == endValue){
                        loadCourses(curType,endValue+1,20,19,6);
                    }else{
                        loadCourses(curType,endPageIndex+1,20,endPageIndex+1,0);
                    }
                }
            }else return;
        },false);
    })();

    /*视频播放*/
    var videoShow = (function(){
        var videoArea = document.querySelector(".video-area");
        var imgBtn = videoArea.querySelector("img");
        var mask = document.querySelector(".video-m");
        var videoCloseBtn = mask.querySelector(".close-btn-big");
        imgBtn.addEventListener("click",function(){
            mask.style.display = "block";
        });
        videoCloseBtn.addEventListener("click",function(){
            mask.style.display = "none";
        });
    })();

    /*加载最热排行*/
    var loadHotRank = (function(){
        var ajaxSuccess = function(xhr){
            var hotRankArea = document.querySelector(".rank-area");
            var hotItem = "";
            var hots = JSON.parse(xhr.responseText);
            var len = 10;
            for(var i=len-1; i>=0; i--){
                var imgUrl = hots[i].smallPhotoUrl;
                var name = hots[i].name;
                var learnerNum = hots[i].learnerCount;
                hotItem += "<li class='rank-item'><img class='left' width='50' height='50' src='" + imgUrl + "' alt=''/><p>" + name +"</p><i></i><span>" + learnerNum + "</span></li>";
            }
            hotRankArea.innerHTML = hotItem;
        };
        var url = "http://study.163.com/webDev/hotcouresByCategory.htm";
        var options = {
            onsuccess: ajaxSuccess
        };
        ajax(url, options);
    })();
})();