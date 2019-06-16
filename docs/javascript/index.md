# [译]JavaScript Async/Await 优于 Promises 的6个原因

> [原文地址](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9)

NodeJS 从7.6版开始支持 async/await。我认为这是从2017年以来 JS 最大的更新了。如果你还没有试过它，这里有一些为什么你应该立刻使用并且再不回头的原因及例子。

[更新]:这篇文章在2019年被编辑的更加贴切了。

## Async/Await 101

那些之前从来没有听过这个话题的人可以看下这块，有一个大概的印象：

* Async/Await 是一个编写异步代码的新方式。之前异步代码的替代方案有回调和 promises。
* Async/Await 其实只是一个建立在 promises 之上的一个语法糖。它不能同普通回调或者 node 回调一起使用。
* Async/Await 跟 promises 一样，不会阻止代码往下执行。
* Async/Await 使得异步代码不论看起来还是行为上都有点像同步代码，这正是它厉害的地方。

## 语法

假设一个`getJSON`函数返回一个 promise，然后 promise 解析 JSON 对象，我们只是调用它然后打印那个 JSON，然后返回 `"done"`。

这是你用 promises 实现的例子：

```javascript
const makeRequest = () =>
  getJSON()
    .then(data => {
      console.log(data)
      return "done"
    })

makeRequest()
```

这是你使用 async/await 的例子：

```javascript
const makeRequest = async () => {
  console.log(await getJSON())
  return "done"
}

makeRequest()
```

这里有几点不同之处：

1. 我们的函数前面有一个 `async` 关键字。`await` 关键字只能在同 `async` 一起定义的函数内部使用。每一个 `async` 函数隐式地返回一个 promise，然后这个 promise resolve 的将会是任意从那个函数的 `return` 返回值(在我们的例子中就是字符串 `"done"`)。

2. 上面那一点表明我们无法在我们代码的顶层使用 await，因为不在 `async` 函数内部。

   ```javascript
   // 这运行不了
   // await makeRequest()
   
   // 这个可以运行
   makeRequest().then((result) => {
     // do something
   })
   ```

3. `await getJSON()` 意味着在 `getJSON()` 返回的 promise 被 resolve 之后才会调用 `console.log` 打印值。

## 为什么它更好？

1. 简明清晰

   看看其实我们没写多少代码，即使是在上面做作的例子中，很明显我们的代码也比较像样。我们不必写 `.then`，创建一个匿名函数来处理返回结果，或者给一个不必使用的变量叫 `data`。我们也可以避免嵌套代码。这些小的优势迅速积累，在我们接下来的代码例子中变得更加明显。

2. 错误处理

   Async/await 使得在同一个代码块中同时处理同步和异步错误成为可能，对于 `try/catch` 有利。在下面使用 promises 的例子中，`try/catch` 无法处理 `JSON.parse` 的失败，因为它在 promise 内部。我们需要在 promise 上面调用 `.catch`，重复处理错误，这比在你的预生产代码里 `console.log` 要负责的多。

   ```javascript
   const makeRequest = () => {
     try {
       getJSON()
         .then(result => {
           // this parse may fail
           const data = JSON.parse(result)
           console.log(data)
         })
         // uncomment this block to handle asynchronous errors
         // .catch((err) => {
         //   console.log(err)
         // })
     } catch (err) {
       console.log(err)
     }
   }
   ```

   现在来看看使用 `async/await` 的代码，`catch` 代码块现在可以处理解析错误了。

   ```javascript
   const makeRequest = async () => {
     try {
       // this parse may fail
       const data = JSON.parse(await getJSON())
       console.log(data)
     } catch (err) {
       console.log(err)
     }
   }
   ```

3. 条件判断

   想象下像下面这样的代码，获取一些数据，然后决定是否应该直接返回还是在已有的值的基础上获得更多的细节。

   ```javascript
   const makeRequest = () => {
     return getJSON()
       .then(data => {
         if (data.needsAnotherRequest) {
           return makeAnotherRequest(data)
             .then(moreData => {
               console.log(moreData)
               return moreData
             })
         } else {
           console.log(data)
           return data
         }
       })
   }
   ```

   这看起来真让人头疼，很容易在嵌套里看晕（6层嵌套），返回语句只需将最终结果给主 promise。

   下面这个使用 async/await 写的例子的可读性就好得多了。

   ```javascript
   const makeRequest = async () => {
     const data = await getJSON()
     if (data.needsAnotherRequest) {
       const moreData = await makeAnotherRequest(data);
       console.log(moreData)
       return moreData
     } else {
       console.log(data)
       return data    
     }
   }
   ```

   