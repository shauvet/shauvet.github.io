<!--
 * @Date: 2019-12-30 18:50:22
 * @LastEditors: guangling
 * @LastEditTime: 2020-02-20 17:23:58
 -->
# 理解 Javascript 选择器

选择器并不特指 Jvascript，React，Redux，或者 Reselect 本文重在讲解这些技术的组合使用，假定你对 React 和 Redux 已经有了比较扎实的理解。那么，让我们开始吧。

## 什么是选择器？

用最简单的话说就是，选择器就是从一个更大的数据集中取出其中的一个子数据集的方法。

### 一个比喻：

想象你在一个大服装店里找皮带，你向店员寻求帮助。她知道皮带在哪能够找到并把皮带取出来给你。在这个例子中，这个店员就扮演了一个选择器。

### 选择器：

* 知道子数据集的去向或者路径
* 返回所请求的数据的子数据集

### 代码：

从商店取皮带的选择器大概代码如下：
```javascript
const getBelts = (state) => state.items.belts
```

## 为什么使用选择器？

基础选择器是有益的，因为它简化了从特定路径查找子数据集的知识，而且选择器可复用还很灵活。要明白我所说的，可以看看下面的例子，`DisplayBelts`组件是一个用来查找皮带的未使用选择器的组件。

```javascript
	// Select belts from the store without use of selectos
class DisplayBelts extends React.Component {
  render() {
    return this.props.belts.map(belt => <img src={belt.imgUrl} />)
  }
}

const mapStateToProps = state => {
  return {
    belts: state.items.belts
  }
}
```
假如企业主在隔壁开了一家咖啡店，服装店的线上 app 被重构，因此现在可以这样获得皮带：`state.shop.items.belts`，`DisplayBelts`组件的`mapStateToProps`方法需要被更新为`belts: state.shop.items.belts`。也不坏，但是假如 app 里的其它组件也需要从 store 中获取皮带，那么开发者将不得不在每一个获取信息的地方更新查询方式，这还不算更新了之后其它所有查询将会受到的影响，例如`DisplayHats`,`DisplayShirts`等等。

那么创建并使用选择器来获取皮带是什么样呢？

```javascript
// Note: selectors are usually created in a relevant reducer file or a separate selectors file
const getBelts = (state) => state.shop.items.belts;

// in DisplayBelts.js
class DisplayBelts extends React.Component {
  render() {
    return this.props.belts.map(belt => <img src={belt.imgUrl} />);
  }
}

const mapStateToProps = state => {
  return {
    belts: getBelts(state)
  }
}
```
在上面的例子中你可以看到基础选择器，`getBetls`只是一个普通的用来获取特定部分状态的函数（这里是获取皮带）。假如将来企业主想要再次重构商店，在更新了相关的 reducer 之后，开发者将不得不更新 `getBelts`。

因为选择器也只是普通的可组合的函数。

```javascript
const getItems = state => state.shop.items

const getBelts = state => {
  const items = getItems(state)
  return items.belts
}
```
总的来说，即使是最基本的选择器也提供了对找到数据知识的封装，让我们可以写出有复用性及可组合的代码。

## 为什么使用 Reselect 来创建选择器？

简单来说是因为性能，因为 Reselect 提供了一层创建选择器的带记忆化功能的封装。

目前为止你见过的选择器的例子仅仅是从 redux store 里面取数据。这对于那些直接从 store 中获取数据的小型 app 是足够的。然而，在更大和更复杂的应用中，我们建议应用 store 的信息保持在几个之内，这样可以减少重复性，而且通常还可以帮助我们避免导致更复杂 reducer 逻辑的多重嵌套。而这跟使用标准化的 store 结构化 app 尤其相关。

在任何情况下，选择器可以用来计算派生数据。

回到我们的商业 app 中，假设我们想找出 store 中的所有商品的现值。我们会创建如下的选择器：

```javascript
const shopItemsSelector = state => state.shop.items
const taxPercentSelector = state => state.shop.taxPercent

const subtotalSelector = state => {
  const items = shopItemsSelector(state)
  return items => items.reduce((acc, item) => acc + item.value, 0)
}

const taxSelector = state => {
  const subtotal = subtotalSelector(state)
  const taxPercent = taxPercentSelector(state)
  return (subtotal, taxPercent) => subtotal * (taxPercent / 100)
}

export const totalSelector = state => {
  const subtotal = subtotalSelector(state)
  const tax = taxSelector(state)
  return (subtotal, tax) => ({ total: subtotal + tax })
}
```

当你考虑到 react 组件由于它们的或者他们父级组件的 state 或者 props 改变时重新渲染的事实，派生数据的计算将会变得很昂贵。Reselect 的最大好处就是它的计算是记忆化的，也就是说除非参数变化，不然它是不会重新计算的。

## Reselect 的语法

Reselect 提供了一个叫做 `createSelector` 的方法来创建记忆化的选择器。这里是一个以我们商店的 app 写的例子：

```javascript
import { createSelector } from 'reselect'

const shopItemsSelector = state => state.shop.items
const taxPercentSelector = state => state.shop.taxPercent

const subtotalSelector = createSelector(
  shopItemsSelector,
  items => items.reduce((acc, item) => acc + item.value, 0)
)

const taxSelector = createSelector(
  subtotalSelector,
  taxPercentSelector,
  (subtotal, taxPercent) => subtotal * (taxPercent / 100)
)

export const totalSelector = createSelector(
  subtotalSelector,
  taxSelector,
  (subtotal, tax) => ({ total: subtotal + tax })
)
```

如你所见，`createSelector`是一个接收两个参数的函数：

1. 选择器 - 如果有多个选择器，它们之间可以以逗号相连，或者也可以使用数组。
2. 转换函数 - 接收从第一个参数的选择器的值，然后进行选择相关数据的函数。

## 使用 Reselect

### 从组件获取 state

```javascript
import {totalSelector} from 'path/to/selector'

class Inventory extends React.Component {
  render() {
    return <h1>`The shop's total inventory is: ${this.props.inventoryValue}`</h1>
  }
}

const mapStateToProps = (state) => {
  return {
    inventoryValue: totalSelector(state)
  }
}
```

这是最基本的应用场景，不用 Reselect 你也可以使用选择器来创建。

### 使用选择器替换 `mapStateToProps` 方法

为了进一步优化性能，可以使用选择器替换 React 组件的 `mapStateToProps` 方法，这样可以减少组件重新渲染的次数。

```javascript
import {totalSelector} from 'path/to/selector'
import {createSelector} from 'reselect'

class Inventory extends React.Component {
  render() {
    return <h1>`The shop's total inventory is: ${this.props.inventoryValue}`</h1>
  }
}

const mapStateToPropsSelector = createSelector(
  totalSelector,
  (total) => {
    return {inventoryValue: total}
  }
)
```

### 使用 CreateStructuredSelector

为了减少样板代码，Reselect 提供了一个 `CreateStructuredSelector` 方法，它可以替换传递给 `connect` 的 `createSelector` 方法。它在组件中最有用的一点是可以拉取几个选择器。

```javascript
import {subtotalSelector, taxPercentSelector, taxSelector, totalSelector} from 'path/to/selector'
import {createStructuredSelector} from 'reselect'

class Inventory extends React.Component {
  render() {
    return (
      <h1>`The shop's total inventory is: ${this.props.inventoryValue}`</h1>
      <h3>`The shop's subtotal inventory is ${this.props.inventorySubtotal}`</h3>
      <h3>`The shop's tax percent is ${this.props.taxPercent}`</h3>
      <h3>`This shop's total tax percent is ${this.props.totalTaxPercent}`</h3>
    )
  }
}

const mapStateToPropsSelector = createStructuredSelector({
  inventorySubtotal: subtotalSelector,
  inventoryValue: totalSelector,
  taxPercent: taxPercentSelector,
  totalTaxPercent: taxSelector
})
```

## 给选择器传递参数

### 传递一个 prop 作为一个参数：

如果你想给选择器传递一个 prop，那么你很幸运。除此之外，state 选择器还可以接受 props。让我们砍一个例子：

```javascript
// In a selector file
import { createSelector } from 'reselect'

const getShopItemsByCategory = (state, props) =>
  state.shop.items[props.category]

const getInStockShopItems = createSelector(
  getItemsByCategory,
  (items) => items.filter(item => item.in_stock)
)

// Used in a component
class ShopItems extends React.Component {
  // display shop items
}
const mapStateToProps = (state, props) => {
  return {
    itemsInStock: getInStockShopItems(state, props)
  }
}
```

"但是有一个问题！"-Reselect 文档这样说。

如果组件在多个地方都使用了带 props 的选择器，那你将会被一个记忆错误终止掉。为什么？因为如果我们有多个组件实例，那么选择器将会在这些实例之间共享。

因此传递给 `getInStockShopItems` 的 props 将会是 `props.category === ‘belts'`，在另一个实例收到 `props.category === 'dresses'`，在另一个实例收到 `props.category === ‘pants'`。这样就会产生问题了，因为 Reselect 的缓存大小是 1，这意味着这时选择器的缓存将会被每一个实例分享，而且由于每一个 `ShopItems` 的输入值一直在变，还会产生不必要的重新计算。

正确的解决办法是保证每个实例有自己私有选择器的拷贝，这样才不会被其它实例影响。

给组件实例自己私有的选择器传递选择器会有如下好处：

> 如果提供给 `connect` 的 `mapStateToProps` 参数从对象换成函数的话，这个函数将会给容器的每个实例创建一个独立的 `mapStateToProps` 函数。

在实践中完成这一点：

1. 创建一个返回选择器的函数。

```javascript
// In a selector file
import { createSelector } from 'reselect'

const getShopItemsByCategory = (state, props) =>
  state.shop.items[props.category]

const makeGetInStockShopItems = () => {
  return createSelector(
    getShopItemsByCategory,
    (items) => items.filter(item => item.in_stock)
  )
}
```
2. 在使用选择器的组件中，创建一个使用 `makeGetInStockShopItems` 函数(在第一步创建)返回 `mapStateToProps` 的对象来创建一个选择器的新拷贝。

```javascript
// Used in a component
class ShopItems extends React.Component {
  // display shop items
}

const makeMapStateToProps = () => {
  const getInStockShopItems = makeGetInStockShopItems()
  const mapStateToProps = (state, props) => {
    return {
      itemsInStock: getInStockShopItems(state, props)
    }
  }
}
```

这将会给组件的每个实例创建一份私有的 `mapStateToProps` 函数。

3. 像平时传递 `mapStateToProps` 那样将 `makeMapStateToProps` (第二步创建的)函数传递给 `connect` 方法：

```javascript
// Used in a component
class ShopItems extends React.Component {
  // display shop items
}

const makeMapStateToProps = () => {
  const getInStockShopItems = makeGetInStockShopItems()
  const mapStateToProps = (state, props) => {
    return {
      itemsInStock: getInStockShopItems(state, props)
    }
  }
}

export default connect(
  makeMapStateToProps
)(ShopItems)
```

就是这样。

### 传递一个静态值的参数

在这种场景下你可以使用[工厂函数](https://medium.com/javascript-scene/javascript-factory-functions-with-es6-4d224591a8b1)。下面这个例子来自 [Reselect 文档](https://github.com/reduxjs/reselect#q-how-do-i-create-a-selector-that-takes-an-argument)：

```javascript
const expensiveItemSelectorFactory = minValue => {
  return createSelector(
    shopItemsSelector,
    items => items.filter(item => item.value > minValue)
  )
}

const subtotalSelector = createSelector(
  expensiveItemSelectorFactory(200),
  items => items.reduce((acc, item) => acc + item.value, 0)
)
```

### 传递一个动态值作为参数：

如果你要给选择器传递一个动态值，Reselect 建议把值存到 store，这样就不必传值了，选择器会像取其他普通流数据那样获得数据。

然后如果你不想把值存到 store，那你可以创建一个接受动态值作为参数的函数然后返回它作为选择器。

关键是你需要自己来做这个函数的记忆化改造，因为 Reselect 只能缓存一个，没办法来记忆额外的参数。提供处理接下来参数记忆化的通常办法是使用 lodash 提供的 memoize 函数来处理。下面的例子也来自[官方文档](https://github.com/reduxjs/reselect#q-how-do-i-create-a-selector-that-takes-an-argument)，你应该仔细看看！

```javascript
import { createSelector } from 'reselect'
import memoize from 'lodash.memoize'

const expensiveSelector = createSelector(
  state => state.items,
  items => memoize(
    minValue => items.filter(item => item.value > minValue)
  )
)

const expensiveFilter = expensiveSelector(state)
```

## 总结

什么是选择器：选择器是可以用来从一个中心数据存储中获得数据的一个函数。你可以独立创建任意独立的选择器。

为什么使用选择器：选择器封装了数据如何存储以及如何获取的知识，这样可以帮助创建高复用的代码。

为什么使用 Reselect：Reselect 提供了一种性能提升的手段，因为它使用记忆化的方式创建选择器，只在输入值变化的情况下才会重新计算。这对于复杂的 app 很有益处，app 可以保持一个微小的 store，这样就可以让选择器来做一些昂贵的操作(例如过滤，累加等等)来计算衍生数据。

## 进一步阅读

1. [Reselect’s Docs](https://github.com/reduxjs/reselect)
2. [Computing Derived Data (Redux Docs)](https://redux.js.org/recipes/computing-derived-data)
3. [React, Reselect and Redux](https://medium.com/@parkerdan/react-reselect-and-redux-b34017f8194c)

> 原文地址：[Understanding Javascript Selectors With and Without Reselect](https://medium.com/@pearlmcphee/selectors-react-redux-reselect-9ab984688dd4
> )
