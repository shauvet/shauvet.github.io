# 一份经典（传统）的前端本地开发环境搭建流程

1. 安装nodejs环境（推荐6.0以后的LTS版本），安装完之后打开终端（mac平台），windows平台可以 WIN+R 打开运行，输入cmd，打开命令窗口，输入npm --version，如果能看到版本，说明已经安装成功；

2. 在本地电脑的工作目录下面，执行 "git clone" + gitlab仓库的地址，把项目克隆下来；

3. 使用编辑器（推荐webstorm或者vs code，功能强大，当然如果有其他熟悉的IDE也可以，前提是熟悉）打开项目，找到node的server文件（一般都是用的express或者koa）：
   
   这个时候我们如果想调服务端的接口一般都会遇到跨域加权限的问题，解决办法主要有两种（如果有更好的欢迎提交修改）：
   
   - 一种是直接在起的服务里改写请求url，使用302转发请求，这样每次本地会发两次请求，参考代码如下：
   
   ``` js
    var express = require('express');
	var app = express();
	var url = require('url');
    var path = require('path');
    
    function urlRewrite(req, res, next) {
      var inUrl = req.url;
      urlRewriteRule(req, res, next);
      var outUrl = req.url;
      if (inUrl != outUrl) {
        res.redirect(302, outUrl)
      } else {
        next()
      }
    }
    
    function urlRewriteRule(req, res, next) {
      var reqUrl = req.url;
      var pathname = url.parse(reqUrl).pathname;

      if (pathname.indexOf('/api') == 0) {
        obj = url.parse(reqUrl);
        obj.port = 6666;
        req.url = 'http://6.6.6.6:6666' + url.format(obj); //测试环境地址，应用端口
      }
    }
    
    //这里就可以写入cookie，返回用户信息，加上ajax请求配置
    //下withCredentials带上cookie就可以绕过测试环境的权限校验，
    //必须注意的前提是当前的cookie必须已经登陆过测试环境才可以
    
    app.use(urlRewrite);
	
   ```
   
   - 第二种方法是使用反向代理把请求转发，从而绕过跨域问题，以常用的webpack-dev-server为例：
   
   ``` js
   module.exports = {
       devServer: {
        historyApiFallback: true,
        contentBase: "./",
        quiet: false, //控制台中不输出打包的信息
        noInfo: false,
        hot: true, //开启热点
        inline: true, //开启页面自动刷新
        lazy: false, //不启动懒加载
        progress: true, //显示打包的进度
        watchOptions: {
            aggregateTimeout: 300
        },
        port: '8088', //设置端口号
        //其实很简单的，只要配置这个参数就可以了
        proxy: {
            '/api':{
            target: 'http://6.6.6.6:6666',
            changeOrigin: true,
            pathRewrite: {
              '^/api': '/api'
            },
          }
        }
    }
   
   ```
   
   上面实例中我们把本地的端口号设置为了8088，如果这个时候接口放在了端口为6666的服务器上，并且我们请求的接口url如下：
   
   ``` js
   
   http://localhost:6666/api
   
   ```
   
   这个时候我们就可以匹配到/api，然后转向target设置的目标服务器对应端口；
   这时候我们只要在ajax请求的url写上/api/XXX就可以自动匹配到请求。