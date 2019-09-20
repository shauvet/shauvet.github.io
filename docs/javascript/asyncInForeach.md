# 在 forEach 内使用 async/await

`async/await` 超级棒，但是有一个地方却有点麻烦：在 `forEach()` 内部使用。

## 我们来试一点东西

```javascript
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
[1, 2, 3].forEach(async (num) => {
  await waitFor(50);
  console.log(num);
});
console.log('Done');
```

然后你可以用 [node.js](https://nodejs.org/zh-cn/) (≥ 7.6.0) 来运行下试试

```javascript
$ node forEach.js
$ Done
```


## 怎么回事？

`console.log(num)` 没在 console 里显示。

我们来自己重写一个 `forEach()` 来理解发生了什么：

```javascript
Array.prototype.forEach = function (callback) {
  for (let index = 0; index < this.length; index++) {
    // 对数组的每一项执行回调
    callback(this[index], index, this);
  }
};
```

这里有一个 MDN 的 polyfill，[*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill)

如你所见，`callback` 被调用了，但是我们没有等它完成就继续执行数组的下一个元素了。

我们可以通过冲澡我们自己的 `asyncForEach()` 方法来解决：

```javascript
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
```

然后我们可以使用我们自己的 `asyncForEach` 方法来更新我们的例子：

```javascript
asyncForEach([1, 2, 3], async (num) => {
  await waitFor(50);
  console.log(num);
})
console.log('Done');
```

在 node 里运行之后，我们发现：

```javascript
$ node forEach.js
$ Done
$ 1
$ 2
$ 3
```

我们正在接近成功。

实际上，我们的 `asyncForEach` 返回了一个 `Promise` （因为它包裹在一个 async 函数内），但是我们没有等待他完成就输出了 ‘DONE’。

我们使用 `async` 来包裹下我们执行的过程：

```javascript
const start = async () => {
  await asyncForEach([1, 2, 3], async (num) => {
    await waitFor(50);
    console.log(num);
  });
  console.log('Done');
}
start();
```

我们再来最后跑一次：

```javascript
$ node forEach.js
$ 1
$ 2
$ 3
$ Done
```

我们现在可以在一起使用 `forEach` 和 `async/await`了。
