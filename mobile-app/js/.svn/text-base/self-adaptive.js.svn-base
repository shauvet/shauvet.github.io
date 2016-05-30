/*!
 * =====================================================
 * 页面自适应jquery  app必引入
 * =====================================================
 */
(function(){
var _w, _zoom, _hd, _orientationChange, _doc = document,
	__style = _doc.getElementById("_zoom");
__style || (_hd = _doc.getElementsByTagName("head")[0], __style = _doc.createElement("style"), _hd.appendChild(_style));
_orientationChange = function() {
	_w = _doc.documentElement.clientWidth || _doc.body.clientWidth;
	_zoom = _w / 720;
	__style.innerHTML = ".zoom {zoom:" + _zoom + ";-webkit-text-size-adjust:auto!important;}";
};
__style.setAttribute("zoom", _zoom);
_orientationChange();
window.addEventListener("resize", _orientationChange, false);
})();