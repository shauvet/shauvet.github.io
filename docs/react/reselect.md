<!--
 * @Date: 2019-12-30 18:50:22
 * @LastEditors: guangling
 * @LastEditTime: 2020-02-19 22:50:51
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
