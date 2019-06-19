# [译]JavaScript Async/Await 优于 Promises 的6个原因

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

4. 媒介值

   你可能会遇到这样一种情况，你调了 `promise1` 之后使用它的返回值来调 `promise2`，然后使用它们返回的结果来调 `promise3`。你的代码看起来可能像这样。

   ```javascript
   const makeRequest = () => {
     return promise1()
       .then(value1 => {
         // do something
         return promise2(value1)
           .then(value2 => {
             // do something          
             return promise3(value1, value2)
           })
       })
   }
   ```

   如果 `promise3` 不需要 `value1` 的话就会容易将 promise 拉平一点。如果你是那种无法忍受这种状况的人，你可以使用 `Promise.all` 将 value 1 和 value 2 包裹，这样可以避免深层次的嵌套，就行这样。 
   
   ```javascript
   const makeRequest = () => {
     return promise1()
       .then(value1 => {
         // do something
         return Promise.all([value1, promise2(value1)])
       })
       .then(([value1, value2]) => {
         // do something          
         return promise3(value1, value2)
       })
   }
   ```
   
   这种方式为了可读性牺牲了语义性。因为没有必要让 `value1` 和 `value2` 一起放在一个数组里，除了避免 promises 的嵌套。
   
   而当使用 async/await 的时候就变得很简单了。它让你想知道在你努力让 promises 看起来不那么可怕的时候你就可以做所有的事情。
   
   ```javascript
   const makeRequest = async () => {
     const value1 = await promise1()
     const value2 = await promise2(value1)
     return promise3(value1, value2)
   }
   ```
   
5. 错误堆栈

   想象下你在一个 promise 链中，在后面的某处发生了错误。

   ```javascript
   
   const makeRequest = () => {
     return callAPromise()
       .then(() => callAPromise())
       .then(() => callAPromise())
       .then(() => callAPromise())
       .then(() => callAPromise())
       .then(() => {
         throw new Error("oops");
       })
   }
   
   makeRequest()
     .catch(err => {
       console.log(err);
       // output
       // Error: oops at callAPromise.then.then.then.then.then (index.js:8:13)
     })
   ```

   从 promise 链返回的错误堆栈信息无从知道错误到底发生在哪儿。更糟糕的是，他还会误导，唯一包含的函数名是 `callAPromise`，而这个函数跟这个错误是完全无关的(文件和函数还是有用的)。

   然而，async/await 里的错误堆栈信息就会指向出错的那个函数。

   ```javascript
   const makeRequest = async () => {
     await callAPromise()
     await callAPromise()
     await callAPromise()
     await callAPromise()
     await callAPromise()
     throw new Error("oops");
   }
   
   makeRequest()
     .catch(err => {
       console.log(err);
       // output
       // Error: oops at makeRequest (index.js:7:9)
     })
   ```

   当你在本地环境开发并且在编辑器打开这个文件时这并没多大帮助，但是对于你排查生产环境的问题就很有帮助了。在这些状况下，知道错误时发生在 `makeRequest` 比只知道错误在一个又一个 `then` 后面要好得多。

6. Debugging

   最后但并不是最不重要的一个。使用 async/await 的一个杀手锏是它很容易进行 debug。在 promises 中进行 debug 很痛苦有两个原因：

   1. 你无法在箭头函数的返回表达式中设置断点(无函数体)。

      ![image](https://cdn-images-1.medium.com/max/1600/1*n_V4LaVdBOFgGCbmTR_VKA.png)

   2. 当你在 `.then` 里面打断点时，断点并不会移动到紧邻的下一个 `.then` 里面去，因为它只会在同步代码中移动断点。

   而使用 async/await 时，你就不必使用箭头函数了，而且你可以一步一步的执行 await 调用，因为它们就是普通的同步代码。

   ![image](https://cdn-images-1.medium.com/max/1600/1*GWYd4eLrs0U96MkNNVB56A.png)

## 总结

Async/await 是近几年 [JavaScript](https://hackernoon.com/tagged/JavaScript) 新增的最具有革命性的特性之一了，它让你意识到 promises 有多么混乱，并且提供了一个直观的替代品。

## 担忧

你可能有一些合理的担忧认为使用这个特性会让异步代码不那么明显：当我们看到一个回调或者 `.then` 时我们的肉眼会认出这是异步代码。而要调整到新的标记却需要几周的适应时间。但是 C# 已经有这项特性很多年了，熟悉它的人们认为这点不适应很微小，并且也只是暂时的不便。

>[原文地址](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9)