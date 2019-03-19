* 翻译自 [medium](https://medium.com/intrinsic/javascript-symbols-but-why-6b02768f4a5c)
* Symbols 的出现是为了什么呢？

* Symbols 是 JavaScript 最新推出的一种基本类型，它被当做对象属性时特别有用，但是有什么是它能做而 String 不能做的呢？

* 在我们开始探索 Symbols 功能之前，我们先来看一下被很多开发者忽略 JavaScript 的特性。

* 背景：

* JavaScript 有两种值类型，一种是 基本类型 （primitives），一种是 对象类型 （objects，包含 function 类型），基本类型包括数字 number （包含 integer，float，Infinity，NaN）,布尔值 boolean，字符串 string，undefined，null，尽管 `typeof null === 'object'`，null 仍然是一个基本类型。

* 基本类型的值是不可变的，当然了，存放基本类型值得变量是可以被重新分配的，例如当你写 `let x = 1; x++`，变量 x 就被重新分配值了，但是你并没有改变原来的1.

* 一些语言，例如 c 语言有引用传递和值传递的概念，JavaScript 也有类似的概念，尽管它传递的数据类型需要推断。