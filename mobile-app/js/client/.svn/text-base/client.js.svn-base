		// H5 plus事件处理
function netEnable(){
	var types = {}; 
	types[plus.networkinfo.CONNECTION_UNKNOW] = "Unknown connection"; 
	types[plus.networkinfo.CONNECTION_NONE] = "None connection"; 
	types[plus.networkinfo.CONNECTION_ETHERNET] = "Ethernet connection"; 
	types[plus.networkinfo.CONNECTION_WIFI] = "WiFi connection"; 
	types[plus.networkinfo.CONNECTION_CELL2G] = "Cellular 2G connection"; 
	types[plus.networkinfo.CONNECTION_CELL3G] = "Cellular 3G connection"; 
	types[plus.networkinfo.CONNECTION_CELL4G] = "Cellular 4G connection"; 
	var isOk = false;
    var curNet = plus.networkinfo.getCurrentType();
    switch(curNet)
    {
    	case plus.networkinfo.CONNECTION_UNKNOW:
    	break;
    	case plus.networkinfo.CONNECTION_WIFI:
    	case plus.networkinfo.CONNECTION_CELL4G:
    	case plus.networkinfo.CONNECTION_CELL3G:
    	isOk = true;
    	break; 
    	
    }
	//alert( "Network: " + types[plus.networkinfo.getCurrentType()] );
	return isOk;
}

		(function($) {
			mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						callback: pulldownRefresh
					},
					up: {
						contentrefresh: '正在加载...',
						callback: pullupRefresh
					}
				}
			});
			/** 
			 * 下拉刷新具体业务实现
			 */
			function pulldownRefresh() {				
				setTimeout(function() {					
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				}, 1500);
			}
			var count = 0;   
			/**
			 * 上拉加载具体业务实现
			 */
			function pullupRefresh() {
				setTimeout(function() {					
						loaddata(); 						
					mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。

				}, 1500);
			}
			if (mui.os.plus) {
				mui.plusReady(function() {
					setTimeout(function() {
						mui('#pullrefresh').pullRefresh().pullupLoading();
//						var wv = plus.webview.all();
//						alert(wv.length);   
					}, 1000);

				});
			} else {
				mui.ready(function() {
					mui('#pullrefresh').pullRefresh().pullupLoading();
				});
			}
			
			var loaddata = function()
			{				
				if(netEnable())
						loadSvrdata();
						else
						loadDemoData();
			}
			
			var loadDemoData = function(){
				var table = document.body.querySelector('.mui-table-view');
					var cells = document.body.querySelectorAll('.mui-table-view-cell');
					for (var i = cells.length, len = i + 3; i < len; i++) { 
						var li = document.createElement('li');
						li.className = 'mui-table-view-cell';
						li.innerHTML = '<div class="content"><a href="client_detail.html"><div class="left"><div class="title"><div class="company">南京坤宁安固科技有限公司 <p>张华&nbsp;&nbsp;成交客户</p></div></div><div class="name">李鸣&nbsp;&nbsp;13566355859</div><div class="record">记录&nbsp;&nbsp;给客户演示，希望手机APP能给每位客户带来方便，也希望大家能够对我们的产品多多提出意见</div><div class="abstract"><p>相关摘要:</p><span>合同/订单10000</span><span>回款19999</span><span>应收30000</span><span>已发货/交付产品100000</span><span>开发票10000</span></div></div><div class="edit"><img src="../images/btn_edit.png" /></div><div class="clear"></div></a></div>';						
						//下拉刷新，新纪录插到最前面；
						table.insertBefore(li, table.firstChild);
					}
			}
                var loadSvrdata = function (){ 
					var kval = plus.storage.getItem("key");
					var url = "http://192.168.1.156:80/api/Customer/List";
					var data = {
						"Key":kval,						
//						"CustName" :"数用"
					};
					$.post(url,data , function(ret) {    
                        var data = JSON.parse(ret); 
                        //alert(data);
                        var table = document.body.querySelector('.mui-table-view');
                     	for(var j = 0; j < data.length; j++){
                     		//alert(data[j].UID); 
                     		var item = data[j];
                     		var li = document.createElement('li');
						li.className = 'mui-table-view-cell';
						li.innerHTML = '<div class="content"><a href="client_detail.html"><div class="left"><div class="title"><div class="company">' 
						+ item.CustName + ' <p>'+ item.StaffName+'&nbsp;&nbsp;成交客户</p></div></div><div class="name">李鸣&nbsp;&nbsp;13566355859</div><div class="record">记录&nbsp;&nbsp;给客户演示，希望手机APP能给每位客户带来方便，也希望大家能够对我们的产品多多提出意见</div><div class="abstract"><p>相关摘要:</p><span>合同/订单'
						+ item.OrderRec + '</span><span>回款19999</span><span>应收30000</span><span>已发货/交付产品100000</span><span>开发票10000</span></div></div><div class="edit"><img src="../images/btn_edit.png" /></div><div class="clear"></div></a></div>';
						table.appendChild(li);	 		
                    
                     	}     
                            //alert(ret); 

//                      for(var i=0;i < 5;i++){ 
//                      	var list = ret[i]; 
//                      	alert(ret);
//                      }
                        
                        
//                      alert(ret);                
//                      uid = JSON.parse(ret);
//                      plus.storage.setItem("UID",uid.UID);
                        
//              (function (){ 
//					var kval = plus.storage.getItem("key");
//					var url = "http://192.168.1.156:80/api/Customer/RemoveCustomer";
//					var data = {
//						"Key":kval,
//						"CustName" :"数用",
//						 UID:uid.UID   
//					};
//					$.post(url,data , function(ret) {    
//                      alert("删除"+ ret);                  
//                      uid = JSON.parse(ret);
//                      plus.storage.setItem("UID",uid.UID);
//                      
//					},'application/json');									
//             })();
					},'application/json');									
                }
               })(mui); 
               