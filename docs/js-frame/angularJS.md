## 关于 angularJS 的 $observe 和 $watch 的区别

* 首先贴原文地址。用我笨拙的英语翻译下，方便不懂英语的童鞋理解，如有更好的翻译可以轻拍砖。。。
[stackOverFlow question](https://stackoverflow.com/questions/14876112/angularjs-difference-between-the-observe-and-watch-methods)


* $observe 是 Attrbutes 对象的一个方法,因此，它只能被用于观察 DOM 的 attribute 属性的值的改变，只能被指令内部使用或调用。当你需要观察一个 DOM 的 attribute 包含插入值（例如 
``` js
attr1="Name: {{name}}"
```
* 然后在指令内部 attrs.$observe(attrs, ...) 假如你试着在指令内部 scope.$watch(attrs.attr1, ...) 这样是不会起作用的，只会得到 undefined。 

* $watch 就比较复杂了，它可以观察表达式，也就是可以是一个 function 或者 string 字符串。假如表达式是一个字符串，它将被解析为一个 function（这个 function 会在每次digest循环都被执行）。字符串不能包含{{}}。$watch 是 scope 上面的一个方法，因此可以用在一个 controller ，通过 ng-view，ng-controller 或一个 directive 的 controller 在 directive 的 link function，因为这个也可以连接到 scope

* 因为字符串被当做 angular 的表达式，$watch 通常被用于你想观察一个 model 或者 scope 的属性（例如 

``` js
attr1="myModel.some_prop"
```
* 然后 
``` js
link function: scope.$watch('myModel.some_prop', ...) 
```
* 或者 
``` js
scope.$watch(attrs.attr1, ...) ）
```

* 假如你试着 
``` js
attrs.$observe('attr1')
```
* 你将会得到字符串 myModel.some_prop，这应该不是你想要的。

* 所有的 $observe 和 $watch 在每次 digest 循环都会被检测。

* 独立作用域的指令更复杂。假如使用了 @ 符号，你可以使用 $observe 或者 $watch 一个 DOM 被插入的属性， $watch 也可以工作的原因是由于 @ 符号帮助我们做了插入(interpolation),因此 $watch 可以看到没有{{}}的字符串。（这里翻译的不知道对不对，请指正）。为了更容易记住何时使用，我建议在这种情况下也使用 $observe。

* 为了帮助我们验证所有这些，作者写了一个 [plunker](http://plnkr.co/edit/HBha8sVdeCqhJtQghGxw?p=preview)。定义了两个指令，d1指令没有创造一个新的 scope，d2 新创造了一个独立的 scope。每个指令都有相同的6个 attributes 属性。每个属性都被 $watch 和 $observe。

``` js
<div d1 attr1="{{prop1}}-test" attr2="prop2" attr3="33" attr4="'a_string'"
        attr5="a_string" attr6="{{1+aNumber}}"></div>
```

* 打开控制台的 console 标签页查看 $observe 和 $watch 在 link function 中不同的表现。然后点击链接查看属性改变后被 click 方法触发后的 $observe 和 $watch 。

 * 注意当 link function 运行时，所有包含的{{}}还没有被执行。查看插入值的唯一方法是使用 $observe（或者 $watch ,假如你使用的是独立的 scope 和 @ ）。因此，获得这些属性值是一个异步的操作。

 * 有时你不需要 $observe 或者 $watch。比方说你的 attribute 包含一个数字 或者 布尔值，相当于在你的 link function 里面 
 ``` js
 var count = scope.$eval(attrs.attr1)
 ```
 * 假如只是一个常量字符串(例如
``` js
attr1="my string"
```
* 那就直接在你的指令里使用attrs.attr1，不需要$eval())。