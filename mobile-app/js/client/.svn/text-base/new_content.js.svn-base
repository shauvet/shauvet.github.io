				(function($) {
					mui.init();
					var clientName = document.getElementById("clientName"); 
					var tag = document.getElementById("tag");
					var linkman = document.getElementById("linkman");
					var mobile = document.getElementById("mobile");
					var address = document.getElementById("address");
					var owner = document.getElementById("owner");   
					var industry = document.getElementById("industry");
					var QuacorGradingValue = document.getElementById("QuacorGradingValue");
					var targetClient = document.getElementById("targetClient");
					var interest = document.getElementById("interest");
					var record = document.getElementById("record");
					// 保存数据到后台
				    var save = function (){ 
						var kval = plus.storage.getItem("key");
						var url = "http://192.168.1.156:80/api/Customer/PostCustomer"; 
						var obj=new Object();
						obj.StaffName= linkman.value;
						obj.Mobile= mobile.value;
						var data = {
							"Key":kval,	
							CustName: clientName.innerHTML,
							EvolveCase_ZD: tag.innerHTML,       
							contactStaff:obj,
							Address: address.value,
							custOwnerName: owner.innerHTML,
							CustStageID:targetClient.innerHTML,   
							IndustryType_ZD: industry.innerHTML,    
	//						MajorExtent_MJ: QuacorGradingValue.innerHTML,
							CustSource_MJ:"1",
							MainProduct: interest.innerHTML,
	   						ECustContact: record.innerHTML
						}; 
				   $.post(url,data , function(ret) {   
				   	 var data = JSON.parse(ret);	
				   	 plus.storage.setItem("UID", data.UID);
	                 var uid = plus.storage.getItem("UID"); 
				   			if(data.Sign == 1){ 
				   				location.href = "client_detail.html";
				   			}else{
				   				alert(data.Message);  
				   			}
						},'application/json');	 								
					};    
			document.getElementById("btnSave").addEventListener('tap', function() { 
						save(); 
					});	
// 										
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
		    }else if(data.type == "marketing"){  
		    var marketing = document.getElementById("marketing");
			marketing.innerHTML = data.value;   
		    }else if(data.type == "gender"){  
		    var gender = document.getElementById("gender");
			gender.innerHTML = data.value;  
		    }
		});
		var currWV = plus.webview.currentWebview();
	// 将页面的参数传到详细页面
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