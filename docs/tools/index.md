# 记录 react15 + webpack1 的 seo 优化之路(1)

## 方案

* (据 pm 讲需求方很早就提过，但是之前没能力或者排期做)，总而言之在项目已经进展到第三期的时候忽然要加 seo 的优化，WTF。。。

* 经过我们仔细筛选，总结出四套方案，待进一步考察：

  >背景是之前的代码都是使用 react15 来写的单页应用，都写了一年多了，忽然想要 seo，WTF。。。幸好不是全部页面要做。。。
  >
  >* Webpack 插件方案，也就是很有名的 `prerender-spa-plugin` 插件，最新的3.x版本原理是使用 Chrome 的 puppeteer 在内部浏览器预先生成就让爬虫爬取静态 html 资源来达到目的。理论上这种方案成本最小，最容易实现，就是不知道我们那古老的 webpack 版本是否支持，后面果然采坑。。。
  >* react-snapshot 方案，也有类似的 react-snap，原理大致是使用 react16 的 [ReactDOMServer](https://reactjs.org/docs/react-dom-server.html) API 的 [`renderToString()`](https://reactjs.org/docs/react-dom-server.html#rendertostring) 方法来实现目的。鉴于升级 webpack 和 react 二选一，我们还是倾向于成本更低的 webpack 升级方案，毕竟现在业务逻辑已经相当不少了，而16的改变又非常大。。。
  >* next.js 方案，也就是大名鼎鼎的 SSR 方案，最彻底，也最有效，but。。。改动成本太大，考虑的优先级会比较低了。
  >* 因为不是所有页面都要做，所以还有种很别捏的方案是把要做 seo 的几个页面拿出来做成多页应用的模式，这种混杂模式带来的维护成本让我们一开始就不太看好这种方案。

* 好了，既然倾向于第一种方案，那就直接开撸吧。九九八十一难开始。。。

* 第一难是 puppeteer 每次都要下载一个78M左右的 Chrome 内核，期间经历过将下载主机设置淘宝镜像(在 `.npmrc文`件中设置 `type puppeteer_download_host=https://npm.taobao.org/mirrors`)，结果有时可以，有时又不行。。。于是果断听从官方建议将默认下载关掉(同样是在 `.npmrc` 文件里加 `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`)，然后自己手动下载好（奇怪的是通过下载软件下载速度飞快。。。）之后移到 `PROJECT_NAME/node_modules/prerender-spa-plugin/.local-chromium`文件夹下。

* 第二难，puppeteer 装好之后，愉快的执行 webpack，然并卵，预期生成的文件夹并没有生成，命令行只是报了一个 `[error] unable to prerender all routes!` google 走起，发现同病相怜的人还真是不少，但是原因五花八门。。。直到翻到一个 issue 里面 `prerender` 插件的作者写的这个报错都是由于 routes 里多传了 `undefined`。这提示我们可能是路由写的有问题，于是在尝试改了路由之后。。。。。。仍然无解，报错还是一样的，导致我们差点怀疑作者说的是不是不够全面。。。于是只好在源码里通过这个报错信息来跟踪错误的源头，逐步加日志输出，发现代码在打开puppeteer 的 Chrome 内核之后爬取的页面仍然是首页，也就是说并不是 react 执行之后生成的资源，继续 debug 最终发现 webpack 的 `publicPath` 路径导致没有生成正确的资源（线上的 path 里面包括 Nginx 配置的路径，本地没有）。

* 第三难，这时候爬取的页面是没有问题了，但是仍然没有生成文件夹，继续 debug 发现在使用 `compiler` 编译器的 `outputFileSystem` 对象时，竟然是 `null`，WTF。。。狗哥走起，发现 node.js 本身有自己的 `outputFileSystem` 但是 webpack 对它进行了改写，在 webpack 的源码里也证实了这一点。那就应该是 webpack 里的这个对象出了问题，开始我们想既然它可以创建外层的文件夹，为什么不能创建内部的文件夹呢。。。这一点没有继续深入跟踪。。。在 `prerender-spa-plugin` 的 issue 里面继续搜 `outputFileSystem` 关键词，发现还真有那么两三个人也遇到这个问题，无一例外的都是因为 webpack 版本不对，然后看到作者说他自己是在 webpack3 的基础上开发测试的，因为只能支持到 webpack3。一开始害怕的终于成真。。。还真是需要升级 webpack 版本呐。。。这时我还想着看看另一个方案也就是 react-snapshot 的方案，搜索一番之后，发现还得借助 react16 的 API，我滴乖乖，就现在那至少没有上千至少也有几百的文件，真要升级，恐怕得脱几层皮不可。。。

* 第四难，于是只好研究下升级 webpack3 的文档，好在不是很复杂。[地址](https://webpack.docschina.org/migrate/3/)在这里，大部分问题顺着这份文档直接就可以解决。这里只说几个文档没说到的点，一个是 less-loader 在处理 `options` 里的 `modifyVars` 配置值时，之前的版本是接收字符串，新的变成了对象，还有一个是 `productionSourceMap` 以前是直接在 config 的根目录，现在放到 

  ```js
  new webpack.LoaderOptionsPlugin({
    options: {
      productionSourceMap: false
    }
  }),
  ```

  顺便提一句，类似的还有开发模式里的 `debug` 也是放到这里配置了，这个插件据说是专门为了从1到2或者3迁移用的，用以兼容1的配置。好了现在创建文件夹也可以成功了。

* 第五难，线上打包是准备好了，本地的 devServer 是不是也得升级下？！答案是毋庸置疑的，必须升了，这里也遇到一个大坑，起服务的时候在 webpack 的加密文件也就是 crypto.js 里爆出了 `updateHash` 方法接收到参数必须是一个字符串或者 buffer（TypeError: Data must be a string or a buffer），坑就坑在完全不知道是哪个模块出的问题，从狗哥里搜到的答案都说是某些文件未找到，至于是哪个文件全靠自己猜了。。。WTF，继续翻官方的 github issue，发现有一个很火的 [issue](https://github.com/webpack/webpack/issues/4072)，参与讨论的就有90多个人，其中真正高质量的是一个叫做 [Toub](https://github.com/webpack/webpack/issues/4072#issuecomment-277246246)的大佬的方案，直接在模块打包的 `HarmonyExportImportedSpecifierDependency.js` 里的方法稍微改写就可以跟踪到：

  ```javascript
  updateHash(hash) {
    super.updateHash(hash);
    const hashValue = this.getHashValue(this.importDependency.module);
  
    if (this.importDependency.module != null){
      // console.log('Module resource: ', this.importDependency.module.resource);
    }else{
      console.log('\nFile not found: ', this.importDependency);
    }
  
    hash.update(hashValue);
  }
  ```

  改完之后，发现毛都没有输出，哪来的 `File not found:` 呢。。。再次卡住，于是转变思路，看看正常模块打包到哪出现了问题，而不是继续找未找到的模块，发现每次都是打包完一个固定的模块出现这个报错，那我就看看文件里面跟这个模块相邻的模块不就可以猜到嘛。。。机智如我。。。但是这还不足以确认，继续 debug，发现有个 `DelegatedModule.js` 的 updateHash 也可以查看到打包的模块的各种属性，而且找到了错误的直接来源：

  ```javascript
  updateHash(hash) {
    hash.update(this.type);
    hash.update(JSON.stringify(this.request));
    super.updateHash(hash);
  }
  ```

  正因为这里的 this.request 为 `undefined` 导致了报错，于是就看了看 request 是 `undefined` 的时候其它属性是什么。最终查到了出问题的模块，改完解决，庆祝下~

* 至此，本地服务也可以正常运行，线上打包也可以正常输出。优化第一步完成。后续问题放在下篇。