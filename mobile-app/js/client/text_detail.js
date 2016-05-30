$(function() {           
				mui.init();
				var isReady = false;
				var curType = "";
				var initBinding = function() {
					window.addEventListener('showedCallback', function(event) {
						//获得事件参数
						var argdata = event.detail.argdata; 
						curType = argdata.type;  					
                        if(curType == "address"){ 
                        	title.innerHTML = "客户地址";
                        }else if(curType == "contact"){
                        	title.innerHTML = "联系人";
                        }
				});
			}; 
				var save = function(){
					text_detail = document.getElementById("text_detail"); 	
							if (isReady) {
								var self = plus.webview.currentWebview();
								var parentWV = self.parent();
								//alert(curType.value);  //从新建页面传过来的标识       
								//触发父页面的subpageCallback事件
								mui.fire(parentWV, 'subpageCallback', {
									data: { 
										type: curType,  
										value:text_detail.value   
									}
								});
								self.hide();  
							}
						};
				if (mui.os.plus) {
					mui.plusReady(function() {  
						isReady = true;  
						initBinding();
					});
				} else {
					mui.ready(function() {
						isReady = true;
						initBinding();
					});
				}
				
			document.getElementById("back").addEventListener('tap', function() { 
				        var self = plus.webview.currentWebview();
				        self.hide();  					
					});	
			document.getElementById("btnSave").addEventListener('tap', function() {
				        save(); 
					});	
			})(mui);