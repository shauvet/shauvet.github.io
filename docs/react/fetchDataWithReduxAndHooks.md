# 通过 Redux 和 Hooks 无缝获取数据

自从 react 在16.7版本发布了试验性的 Hooks 特性之后，它已经风靡 react 社区。
我特别喜欢将数据从组件中提取出来。平时我通过一个 SomeEntitiesLoader 高阶组件来管理数据获取以及在需要的时候重新获取。我们来看一个简单的实现：

```javascript
import { Component } from 'react';

export class ItemsLoader extends Component {
  componentDidMount() {
    const { loadItems, sort, sortDirection } = this.props;

    loadItems(sort, sortDirection);
  }

  componentDidUpdate(prevProps) {
    const { sort, sortDirection, loadItems } = this.props;

    if (prevProps.sort !== sort || prevProps.sortDirection !== sortDirection) {
      loadItems(sort, sortDirection);
    }
  }

  render () {
    const { search, sort, sortDirection, render, items, isLoading } = this.props;

    return render({
      items: items.filter(item => item.includes(search)), 
      isLoading
    });
  }
}

export default connect(
  state => ({
    items: state.items,
    isLoading: state.isLoading
  }),
  {
    loadItems: loadItems
  }
)(ItemsLoader)
```

看起来很简单是不是，假设我们在后端排序，在前端搜索，那么当排序字段和排序方向变了之后我们需要重新加载。但是很可能你会有多个数据源头需要去加载，而且我们想要重用这个高阶组件。那我们就需要重写这个组件。

为了重用我把 redux 的 connect 去掉了，同时新加了一些属性：
* loadProps - 数据获取所需的参数
* shouldReload - 将现有属性和接收到的属性进行对比，决定是否需要重新加载
* renderProps - 传递的 render 方法

```javascript
import { Component } from 'react';

export class SharedLoader extends Component {
  componentDidMount() {
    const { loadItems, ...rest } = this.props;

    loadItems(loadProps(rest));
  }

  componentDidUpdate(prevProps) {
    const { loadItems, loadProps, shouldReload, ...rest } = this.props;

    if (shouldReload(rest, prevProps)) {
      loadItems(loadProps(rest));
    }
  }

  render () {
    const { render, renderProps } = this.props;

    return render(...renderProps);
  }
}
```
现在我们可以在任何加载器上应用这个组件了。当我们想重用这个组件，只需要通过 redux connect 或任何其他方法重新定义这些属性就好了。

```javascript
import { connect } from 'react-redux';
import * as R from 'ramda';
import { SharedLoader } from './SharedLoader';

const pickLoadProps = R.pick(['sort', 'sortDirection']);

export default connect(
  // map state to props
  state => ({
    items: state.items,
    isLoading: state.isLoading,
  }),
  // map dispatch to props
  {
    loadItems: loadItems,
  },
  // merge props
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    loadProps: R.pick(['sort', 'sortDirection']),
    shouldReload: (current, prev) => !R.equals(pickLoadProps(current), pickLoadProps(prev)),
    renderProps: R.pick(['sort', 'sortDirection', 'search', 'items', 'isLoading']),
  })
)(SharedLoader);
```
这里有一个使用这个组件的例子。我们把属性传给加载器，然后根据传递给加载器的属性来渲染结果。
```javascript
	import React from 'react';
  import ProductsLoader from './ProductsLoader';
  import { ProductsList } from './ProductsList';

  export const ProductsPage = ({ productsSort, productsSortDirection, productsSearch }) => (
    <ProductsLoader
      sort={productsSort}
      sortDirection={productsSortDirection}
      search={productsSearch}
      render={({ items, isLoading, sort, sortDirection, search }) => (
        <ProductsList 
          products={items} 
          isLoading={isLoading} 
          sort={sort} 
          sortDirection={sortDirection} 
          search={search} 
        />
      )}
    />
  );
```
## 试试 React Hooks ？

我们的 SharedLoader 可以工作，但是对于这么一个小用途来说太过于笨重了，我们不得不调用两个生命周期函数然后再对属性执行对比。它也允许我们把不相关的逻辑放到这些方法里。

我们想要做的就是把组件分割成小一点的相关的函数。根据 [React Hooks 文档](https://reactjs.org/docs/hooks-intro.html)
> 使用 Hooks，你可以把状态逻辑从组件提取出来，这样就会方便复用以及测试。Hooks 让你可以复用有状态的逻辑而不用改变组件层级。这样就可以很容易地在许多组件之间或者社区分享 Hooks了。
> 

** useEffect hook **
接受一个包含命令式的，可能有副作用代码的函数为参数。
> Mutations, subscriptions, timers, logging, 以及其它副作用是不被允许在函数组件内的（在 React 的 render 阶段被引用）。这样会导致令人困惑的 bug 以及 UI 层面的不一致性。
> 

根据文档，传递给 useEffect 的函数在布局和绘制完成之后触发。当组件改变执行完了后执行副作用比较合适，然后我们可以用 hook 来替换 componentDidMount 和 componentDidUpdate。

effect 依赖的值作为数组传递给 useEffect 的第二个参数，因此我们可以把这些值传递给 useEffect 的第二个参数来替换属性比较的逻辑。

我们来重写下 SharedLoader：
```javascript
	import { useEffect } from 'react';

export default function SharedLoader({ loadItems, loadProps, memoProps, renderProps, render, ...rest }) {
  // when we pass empty array effect runs only once after mount
  useEffect(() => {
    loadItems(loadProps(rest));
  }, []);

  // run effect when memoProps output is change
  useEffect(() => {
    loadItems(loadProps(rest));
  }, memoProps(rest));

  return render(renderProps(rest));
}
```
如你所见，我们用两个 effect 调用替换了 componentDidMount 和 componentDidUpdate 。组件 API 唯一的改变是移除了 shouldReload 属性，增加了 memoProps 函数。

memoProps 是一个接受 loadProps 参数并将对象转换为值的数组简单方法。

<code>const mempProps = R.compose(R.values, loadProps);</code>

## 总结

最后我们有了一个相对较小的组件，专门用来在属性改变的时候加载数据。我们可以完全控制这个逻辑，而且在我们需要加载数据的大多数常用场景中复用。

现在我们是在前端搜索数据，但如果需要将参数传递给后端，我们也只需要重写我们的 loadProps 和 memoProps ，当需求真的要改变时我们也很容易做出改变。

> 原文地址：https://medium.com/@egorsapronov/seamless-data-fetching-with-redux-and-react-hooks-108ece925d92

