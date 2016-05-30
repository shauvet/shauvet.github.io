$(function() {           
				mui.init();
				var isReady = false;
				var curType = "";
				var initBinding = function() {
					window.addEventListener('showedCallback', function(event) {
						//获得事件参数
						var argdata = event.detail.argdata; 
						curType = argdata.type;   
						clientName = document.getElementById("clientName"); 
				});
			}; 
				var save = function(){
							if (isReady) {
								var self = plus.webview.currentWebview();
								var parentWV = self.parent();
								//alert(curType.value);  //从新建页面传过来的标识       
								//触发父页面的subpageCallback事件
								mui.fire(parentWV, 'subpageCallback', {
									data: { 
										type: curType,  
										value: clientName.value  
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