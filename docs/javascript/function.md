## 柯里化函数

* 从小红书到各种网站博客说的柯里化在印象里一直是不明觉厉的样子。

* 今天好好研究下，首先说定义，柯里化通常也称部分求值，其含义是给函数分步传递参数，每次传递参数后,部分应用参数，并返回一个更具体的函数接受剩下的参数，中间可嵌套多层这样的接受部分参数函数，逐步缩小函数的适用范围，逐步求解,直至返回最后结果。

 

接下来来一个通用的例子，

``` js
var curring = function(fn){
        var _args = [];
        return function cb(){

            if(arguments.length === 0) {
                return fn.apply(this, _args);
            }

            Array.prototype.push.apply(_args, [].slice.call(arguments));

            return cb;
        }


    }
```
然后是给一个实际例子，
``` js
var multi = function(){

        var total = 0;
        var argsArray = Array.prototype.slice.call(arguments);
            argsArray.forEach(function(item){
                total += item;
            })

        return total
    };

    var calc = curring(multi);

    calc(1,2)(3)(4,5,6);

    console.log(calc()); //空白调用时才真正计算
```

总结：柯里化函数具有以下特点：

> 函数可以作为参数传递

> 函数能够作为函数的返回值

> 闭包

 