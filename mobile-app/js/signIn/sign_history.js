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
//	alert( "Network: " + types[plus.networkinfo.getCurrentType()] );
	return isOk;
}

		(function($) {
			mui.init();
				if (mui.os.plus) {
					mui.plusReady(function() {
						isReady = true;  
						loaddata();
					});
				} else {
					mui.ready(function() {
						isReady = true;
						loaddata();
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
					var html = "";  
				    var form = jQuery('#form1');
				    html = html + '<a href="signIn_detail.html"><div class="visit"><div class="name">南京坤宁安固科技有限公司<span>拜访离开</span></div><div class="address">浙江省杭州市滨江聚财区</div><div class="time"><span>@李华</span>2015-7-25&nbsp;&nbsp;17:10</div></div></a>'
				    + '<a href="signIn_detail.html"><div class="visit"><div class="name">南京坤宁安固科技有限公司<span>前去拜访</span></div><div class="address">浙江省杭州市滨江聚财区</div><div class="time"><span>@李华</span>2015-7-25&nbsp;&nbsp;17:10</div></div></a>'
				    + '<a href="signIn_detail.html"><div class="visit"><div class="address">浙江省杭州市滨江聚财区<span>签到</span></div><div class="time"><span>@李华</span>2015-7-25&nbsp;&nbsp;17:10</div></div></a>';
			        form.append(html);        
			}
                var loadSvrdata = function (){ 
					var kval = plus.storage.getItem("key");  
					var url = "";
					var data = {
						"Key":kval,						
					};
					$.post(url,data , function(ret) {    
//                      var data = JSON.parse(ret);   
					},'application/json');									
                }
               })(mui); 
               