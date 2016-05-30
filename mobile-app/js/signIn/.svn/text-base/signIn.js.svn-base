// 定位
var ws=null,wo=null;
var em=null,map=null;
// H5 plus事件处理
function plusReady(){
	if(!em||ws){return};
	// 获取窗口对象
	ws=plus.webview.currentWebview();
	wo=ws.opener();
	setTimeout(function(){
		map=new plus.maps.Map("map");
	    map.showUserLocation( true );
	    map.getUserLocation(function(state,pos){
		if(0==state){
			map.setCenter(pos);    
		    marker.setIcon("../images/icon_map.png");
	        map.addOverlay(marker);
		}
	});
//		map.centerAndZoom(new plus.maps.Point(116.3977,39.906016),12);
		createMarker();
		// 创建子窗口
		createSubview(); 
	},300);
	// 显示页面并关闭等待框
    ws.show("pop-in");
    
}

if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}
// DOMContentloaded事件处理
document.addEventListener("DOMContentLoaded",function(){ 
	em=document.getElementById("map");
	window.plus&&plusReady();
},false); 
//function userLocation(){
//	map.showUserLocation( true );
//	map.getUserLocation(function(state,pos){
//		if(0==state){
//			map.setCenter(pos);
//		}
//	});
//}
var watchId;
function geoInf( position ) {
	var str = ""; 
	var codns = position.coords;//获取地理坐标信息；
	var lat = codns.latitude;//获取到当前位置的纬度；
	str += "纬度："+lat+"\n";
	var longt = codns.longitude;//获取到当前位置的经度 
	str += "经度："+longt+"\n";
	outLine( str );
	alert(str);
}
 //通过百度定位模块获取位置信息
function getPosBaidu(){
	outSet( "获取百度定位位置信息:" );
	plus.geolocation.getCurrentPosition( geoInf, function ( e ) {
		outSet( "获取百度定位位置信息失败："+e.message );
	},{provider:'baidu'});
}
// 拍照
var i=1,gentry=null,w=null;
var hl=null,le=null,de=null,ie=null;
var unv=true;
// H5 plus事件处理
function plusReady(){
	// 获取摄像头目录对象
	plus.io.resolveLocalFileSystemURL( "_doc/", function ( entry ) {
		entry.getDirectory( "camera", {create:true}, function ( dir ) {
			gentry = dir;
			updateHistory();
		}, function ( e ) {
			outSet( "Get directory \"camera\" failed: "+e.message );
		} );
	}, function ( e ) {
		outSet( "Resolve \"_doc/\" failed: "+e.message );
	} );
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}
// 监听DOMContentLoaded事件
document.addEventListener("DOMContentLoaded",function(){
	// 获取DOM元素对象
	hl=document.getElementById("history");
	le=document.getElementById("empty");
	de=document.getElementById("display");
	if(ie=document.getElementById("index")){
		ie.onchange=indexChanged;
	}
	// 判断是否支持video标签
	unv=!document.createElement('video').canPlayType;
},false );
function changeIndex() {
	outSet( "选择摄像头：" );
	ie.focus();
}
function indexChanged() {
	de.innerText = ie.options[ie.selectedIndex].innerText;
	i = parseInt( ie.value );
	outLine( de.innerText );
}
// 拍照
function getImage() {
	outSet( "开始拍照：" );
	var cmr = plus.camera.getCamera();
	cmr.captureImage( function ( p ) {
		outLine( "成功："+p );
		plus.io.resolveLocalFileSystemURL( p, function ( entry ) {
			createItem( entry );
		}, function ( e ) {
			outLine( "读取拍照文件错误："+e.message );
		} );
	}, function ( e ) {
		outLine( "失败："+e.message );
	}, {filename:"_doc/camera/",index:1} );
}
// 录像
function getVideo() {
	outSet( "开始录像：" );
	var cmr = plus.camera.getCamera();
	cmr.startVideoCapture( function ( p ) {
		outLine( "成功："+p );
		plus.io.resolveLocalFileSystemURL( p, function( entry) {
			createItem( entry );
		}, function( e ) {
			outLine( "读取录像文件错误："+e.message );
		} );
	}, function( e ){
		outLine( "失败："+e.message );
	}, {filename:"_doc/camera/",index:i} );
}
// 显示文件
function displayFile( li ) {
	if ( w ) {
		outLine( "重复点击！" );
		return;
	}
	if ( !li || !li.entry ) {
		ouSet( "无效的媒体文件" ); 
		return;
	}
	var name = li.entry.name;
	var suffix = name.substr(name.lastIndexOf('.'));
	var url = "";
	if ( suffix==".mov" || suffix==".3gp" || suffix==".mp4" || suffix==".avi" ){
		//if(unv){plus.runtime.openFile("_doc/camera/"+name);return;}
		url = "camera_video.html";
	} else {
		url = "camera_image.html";
	}
	w=plus.webview.create(url,url,{scrollIndicator:'none',scalable:true,bounce:"all"});
	w.addEventListener( "loaded", function(){
		w.evalJS( "loadMedia('"+li.entry.toLocalURL()+"')" );
		//w.evalJS( "loadMedia(\""+"http://localhost:13131/_doc/camera/"+name+"\")" );
	}, false );
	w.addEventListener( "close", function() {
		w = null;
	}, false );
	w.show( "pop-in" );
}

// 添加播放项
function createItem( entry ) {
	var li = document.createElement("li");
	li.className = "ditem";
	li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	li.setAttribute( "onclick", "displayFile(this);" );
	hl.insertBefore( li, le.nextSibling );
	li.querySelector(".aname").innerText = entry.name;
	li.querySelector(".ainf").innerText = "...";
	li.entry = entry;
	updateInformation( li );
	// 设置空项不可见
	le.style.display = "none";
}
// 获取录音文件信息
function updateInformation( li ) {
	if ( !li || !li.entry ) {
		return;
	}
	var entry = li.entry;
	entry.getMetadata( function ( metadata ) {
		li.querySelector( ".ainf" ).innerText = dateToStr( metadata.modificationTime );
	}, function ( e ) {
		outLine( "获取文件\""+entry.name+"\"信息失败："+e.message );
	} );
}
// 获取录音历史列表
function updateHistory() {
	if ( !gentry ) {
		return;
	}
  	var reader = gentry.createReader();
  	reader.readEntries( function ( entries ) {
  		for ( var i in entries ) {
  			if ( entries[i].isFile ) {
  				createItem( entries[i] );
  			}
  		}
  	}, function ( e ) {
  		outLine( "读取录音列表失败："+e.message );
  	} );
}
// 清除历史记录
function cleanHistory() {
	hl.innerHTML = '<li id="empty" class="ditem-empty">无历史记录</li>';
	le = document.getElementById( "empty" );
	// 删除音频文件
	outSet( "清空拍照录像历史记录：" );
	gentry.removeRecursively( function () {
		// Success
		outLine( "成功！" );
	}, function ( e ) {
		outLine( "失败："+e.message ); 
	});
}

// 选择操作
		mui.init({
			swipeBack:true //启用右滑关闭功能
		});
		mui('body').on('shown', '.mui-popover', function(e) {
			//console.log('shown', e.detail.id);//detail为当前popover元素
		});
		mui('body').on('hidden', '.mui-popover', function(e) {
			//console.log('hidden', e.detail.id);//detail为当前popover元素
		});
		var info = document.getElementById("info");
		document.getElementById("picture-btn").addEventListener('tap',function () {
			var btnArray = [{title:"签到"},{title:"签退"},{title:"前去拜访"},{title:"拜访离开"}];
			plus.nativeUI.actionSheet( {
				title:"选择操作",   
				cancel:"取消",
				buttons:btnArray
			}, function(e){
				var index = e.index;
				var text = "";
				switch (index){
					case 0:
						text += "取消";
						break;
					case 1:
						text += "签到";
						break;
					case 2:
						text += "签退";
						break;
					case 3:
						text += "前去拜访";
						break;
					case 4:
						text += "拜访离开";
						break;
				}
				info.innerHTML = text;
			} );
		});