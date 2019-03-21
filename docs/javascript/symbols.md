## Symbols 的出现是为了什么呢？

* 翻译自 [medium](https://medium.com/intrinsic/javascript-symbols-but-why-6b02768f4a5c)

* Symbols 是 JavaScript 最新推出的一种基本类型，它被当做对象属性时特别有用，但是有什么是它能做而 String 不能做的呢？

* 在我们开始探索 Symbols 功能之前，我们先来看一下被很多开发者忽略 JavaScript 的特性。

### 背景：

* JavaScript 有两种值类型，一种是 基本类型 （primitives），一种是 对象类型 （objects，包含 function 类型），基本类型包括数字 number （包含 integer，float，Infinity，NaN）,布尔值 boolean，字符串 string，undefined，null，尽管 `typeof null === 'object'`，null 仍然是一个基本类型。

* 基本类型的值是不可变的，当然了，存放基本类型值得变量是可以被重新分配的，例如当你写 `let x = 1; x++`，变量 x 就被重新分配值了，但是你并没有改变原来的1.

* 一些语言，例如 c 语言有引用传递和值传递的概念，JavaScript 也有类似的概念，尽管它传递的数据类型需要推断。当你给一个 function 传值的时候，重新分配值并不会修改该方法调用时的参数值。然而，假如你修改一个非基本类型的值，修改值也会影响原来的值。

* 考虑下下面的例子：

```
function primitiveMutator(val) {
  val = val + 1;
}
let x = 1;
primitiveMutator(x);
console.log(x); // 1
function objectMutator(val) {
  val.prop = val.prop + 1;
}
let obj = { prop: 1 };
objectMutator(obj);
console.log(obj.prop); // 2
```

基本类型的值永远同值一样的值相等（除了奇怪的 NaN ），看看这里：

```
const first = "abc" + "def";
const second = "ab" + "cd" + "ef";
console.log(first === second); // true
```

然而，非基本类型的值即使内容一样，但也不相等，看看这里：

```
const obj1 = { name: "Intrinsic" };
const obj2 = { name: "Intrinsic" };
console.log(obj1 === obj2); // false
// Though, their .name properties ARE primitives:
console.log(obj1.name === obj2.name); // true
```

对象扮演了一个 JavaScript 语言的基本角色，它们被到处使用，它们常被用在键值对的存储。然而这样使用有一个很大的限制：在 symbols 诞生之前，对象的键只能是字符串。假如我们试着使用一个非字符串当做对象的键，就会被转换为字符串，如下所示：

```
const obj = {};
obj.foo = 'foo';
obj['bar'] = 'bar';
obj[2] = 2;
obj[{}] = 'someobj';
console.log(obj);
// { '2': 2, foo: 'foo', bar: 'bar',
     '[object Object]': 'someobj' }
```

注意：稍微离一下题，Map 数据结构被创建的目的就是为了应对存储键值对中，键不是字符串的情况。

### symbols 是什么？

* 现在我们知道了什么是基本类型，终于准备好如何定义什么是 symbols 了。symbols 是一种无法被重建的基本类型。这时 symbols 有点类似与对象创建的实例互相不相等的情况，但同时 symbols 又是一种无法被改变的基本类型数据。这里有一个例子：

```
const s1 = Symbol();
const s2 = Symbol();
console.log(s1 === s2); // false
```

当你初始化一个带有一个接收可选字符串参数的 symbols 时，我们可以来 debug 看下，除此之外看看它会否影响自身。

```
const s1 = Symbol('debug');
const str = 'debug';
const s2 = Symbol('xxyy');
console.log(s1 === str); // false
console.log(s1 === s2); // false
console.log(s1); // Symbol(debug)
```

### symbols 作为对象的属性

* symbols 有另一个很重要的用途，就是用作对象的 key。这儿有一个 symbols 作为对象 key 使用的例子：

```
const obj = {};
const sym = Symbol();
obj[sym] = 'foo';
obj.bar = 'bar';
console.log(obj); // { bar: 'bar' }
console.log(sym in obj); // true
console.log(obj[sym]); // foo
console.log(Object.keys(obj)); // ['bar']
```

* 我们注意到使用 Object.keys() 并没有返回 symbols，这是为了向后兼容性的考虑。老代码不兼容 symbols，因此古老的 Object.keys() 不应该返回 symbols。

* 看第一眼，我们可能会觉得 symbols 这个特性很适合作为对象的私有属性，许多其他语言都要类似的类的隐藏属性，这一直被认为是 JavaScript 的一大短板。不幸的是，还是有可能通过 symbols 来取到对象的值，甚至都不用试着获取对象属性就可以得到对象 key，例如，通过 Reflect.ownKeys() 方法就可以获取所有的 key，包括 字符串和 symbols，如下所示：

```
function tryToAddPrivate(o) {
  o[Symbol('Pseudo Private')] = 42;
}
const obj = { prop: 'hello' };
tryToAddPrivate(obj);
console.log(Reflect.ownKeys(obj));
        // [ 'prop', Symbol(Pseudo Private) ]
console.log(obj[Reflect.ownKeys(obj)[1]]); // 42
```

* 注意：现在已经有一个旨在解决 JavaScript 私有属性的提案，叫做 [Private Fields](https://github.com/tc39/proposal-class-fields#private-fields)，尽管这并不会使所有的对象受益，它仍然对对象的实例有用，Private Fields 在 Chrome 74版本可用。

### 阻止对象属性名冲突

* symbols 可能对对象的私有属性没有直接好处，但是它有另外一个用途，它在不知道对象原有属性名的情况下，扩展对象属性很有用。
* 考虑一下当两个不同的库要读取对象的一些原始属性时，或许它们都想要类似的标识符。如果只是简单的使用字符串 id 作为 key，这将会有很大的风险，因为它们的 key 完全有可能相同。

```
function lib1tag(obj) {
  obj.id = 42;
}
function lib2tag(obj) {
  obj.id = 369;
}
```
