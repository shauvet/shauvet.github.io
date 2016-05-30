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
				    html = html + '<div class="title"><img src="../images/icon-new.png">'
			+ '<span>14:00</span><div class="company_name">杭州聚光科技有限公司</div></div>'
		    + '<div class="content"><div class="left"><img src="../images/images_test2.png"/></div>'
			+ '<div class="right"><div class="name">洪玲玲<span>登门拜访</span></div>'
			+ '<div class="mid_content">初步联系，有意向，目前有5人</div><p>联系人:李鸣13897533467</p>'
			+ '<p><img src="../images/ioc_weizhi.png"/>浙江省杭州市滨江区江虹路611号</p>'
			+ '</div><div class="clear"></div></div>';
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
