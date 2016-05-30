			function showHideCode() {	
				if($("#moreDiv").text().trim() == "更多"){
					$("#moreDiv").text("收起"); 
				}else{
					$("#moreDiv").text("更多"); 
				}
				$("#showdiv").toggle(); 
			}
			
			$(function() {		
				$("#btn1").click(function() {
					$(this).toggleClass("img02");
					$("#content1").slideToggle();
				});
					$("#btn2").click(function() {
					$(this).toggleClass("img02");
					$("#content2").slideToggle();
				});
				$("#btn3").click(function() {
					$(this).toggleClass("img02");
					$("#content3").slideToggle();
				});
			});
				
				
		/** 显示页面数据 */
			(function($) {
				mui.init();
			if (mui.os.plus) {
				mui.plusReady(function() {
						getView(); 
				});
			} else {
				mui.ready(function() {
					getView();
				});
			}
				var getView = function() {
					var kval = plus.storage.getItem("key");
					var uid = plus.storage.getItem("UID");
					var url = "http://192.168.1.156:80/api/Customer/ViewCustomer";      
					var data = {
						"Key":kval,	
						 UID:uid
					}; 
					$.post(url,data , function(ret) {
                        var obj = JSON.parse(ret); 
                        document.getElementById('name').innerHTML= obj.CustName;
                        document.getElementById('linkman').innerHTML= obj.contactStaff.StaffName;   
                        document.getElementById('industry').innerHTML= obj.IndustryType_ZD; 
                        document.getElementById('owner').innerHTML= obj.custOwnerName;
                        document.getElementById('name').innerHTML= obj.CustName;
                        document.getElementById('name').innerHTML= obj.CustName;
                        document.getElementById('name').innerHTML= obj.CustName;
                        document.getElementById('name').innerHTML= obj.CustName;
                        document.getElementById('name').innerHTML= obj.CustName;
                        document.getElementById('name').innerHTML= obj.CustName;
                        document.getElementById('name').innerHTML= obj.CustName;
                        document.getElementById('name').innerHTML= obj.CustName;
                        document.getElementById('name').innerHTML= obj.CustName;
					},'application/json');	 								
				} 
				
					var initBinding = function() {
	
		//添加newId自定义事件监听
		window.addEventListener('subpageCallback', function(event) {
			//获得事件参数
			var data = event.detail.data; 
			//根据id向服务器请求新闻详情
   			//alert("type=" + data.type + ";value=" + data.value);
		    if(data.type == "tag"){
		    var tag = document.getElementById("tag");
			tag.innerHTML = data.value; 
		    }else if(data.type == "owner"){
		    var owner = document.getElementById("owner");
			owner.innerHTML = data.value; 
		    }else if(data.type == "clientType"){
		    var clientType = document.getElementById("clientType");
			clientType.innerHTML = data.value;  
		    }else if(data.type == "clientName"){
		    var clientName = document.getElementById("clientName");
			clientName.innerHTML = data.value; 
			}else if(data.type == "clientNameList"){
		    var clientNameList = document.getElementById("clientNameList");
			clientNameList.innerHTML = data.value;       
		    }else if(data.type == "targetClient"){
		    var targetClient = document.getElementById("targetClient");
			targetClient.innerHTML = data.value;  
		    }else if(data.type == "industry"){
		    var industry = document.getElementById("industry");
			industry.innerHTML = data.value;  
		    }else if(data.type == "source"){
		    var source = document.getElementById("source");
			source.innerHTML = data.value;   
		    }else if(data.type == "interest"){
		    var interest = document.getElementById("interest");
			interest.innerHTML = data.value;   
		    }else if(data.type == "address"){  
		    var address = document.getElementById("address");
			address.innerHTML = data.value;
			alert("address");
		    }else if(data.type == "linkman"){
		    var linkman = document.getElementById("linkman");
			linkman.innerHTML = data.value;    
		    }
		});
		var currWV = plus.webview.currentWebview();
	
		jQuery(".link_btn").each(function(i, el) {
			el.addEventListener('tap', function() {
			var _this = jQuery(this);
			var _url = _this.attr("url");
			var _data = JSON.parse(_this.attr("data").toString()); 
	//			var elTitle = jQuery(this).find(".title").text(); 
	//			alert(plus.webview.all().length); 
				var wv = plus.webview.getWebviewById(_url);
			//	alert(wv);
				if (wv == undefined) {
	//				alert("create");
					wv = plus.webview.create(
						_url, _url, {}, {}					
					);  
				}
	//			alert(plus.webview.all().length);
				currWV.append(wv);
				
				wv.show("auto",600,function(){
					 mui.fire(wv,'showedCallback',{
									  	argdata:_data,
									  });
				}, {});
			});
		});
	
	};
	   	
	if (mui.os.plus) {
		mui.plusReady(function() {
			initBinding();
		});
	} else {
		mui.ready(function() {
			initBinding();
		});
	}
			})(mui);
			
			/** 评分 */
				var GradList = document.getElementById("QuacorGrading").getElementsByTagName("input");
				for (var di = 6; di < parseInt(document.getElementById("QuacorGradingValue").getElementsByTagName("font")[0].innerHTML); di++) {
					GradList[di].style.backgroundPosition = 'left center';
				}
				for (var i = 0; i < GradList.length; i++) {
					GradList[i].onmouseover = function() {
						for (var Qi = 0; Qi < GradList.length; Qi++) {
							GradList[Qi].style.backgroundPosition = 'right center';
						}
						for (var Qii = 0; Qii < this.name; Qii++) {
							GradList[Qii].style.backgroundPosition = 'left center';
						}
					}
				}

				for (n = 1; n < 3; n++) {
					var page = 'pagenavi' + n;
					var mslide = 'slider' + n;
					var mtitle = 'emtitle' + n;
					arrdiv = 'arrdiv' + n;
					var as = document.getElementById(page).getElementsByTagName('a');
					var tt = new TouchSlider({
						id: mslide,
						'auto': '-1',
						fx: 'ease-out',
						direction: 'left',
						speed: 300,
						timeout: 5000,
						'before': function(index) {
							var as = document.getElementById(this.page).getElementsByTagName('a');
							as[this.p].className = '';
							as[index].className = 'active';
							this.p = index;
							var txt = as[index].innerText;
							$("#" + this.page).parent().find('.emtitle').text(txt);
						}
					});
					tt.page = page;
					tt.p = 0;
					//console.dir(tt); console.dir(tt.__proto__);				
					for (var i = 0; i < as.length; i++) {
						(function() {
							var j = i;
							as[j].tt = tt;
							as[j].onclick = function() {
								this.tt.slide(j);
								return false;
							}
						})();
					}
				}