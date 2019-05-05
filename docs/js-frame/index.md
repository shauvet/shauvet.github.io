## 开发类 redux 库来理解状态管理

> 对于想要直接看结果，跳过文章的人，我已经把我写的内容制作成了一个库：[use-simple-state](https://github.com/Jahans3/use-simple-state)，无任何依赖（不像redux 还依赖 react ），只有3kb，相当轻量。

* 近几年，应我们的 app 增长的需要，web 应用数量增长迅速，随之而来的还有复杂性。为了使增加的复杂性易于处理，应用某些新增的技巧和模式使得开发者可以更简单的处理以及帮助我们建立更加健壮的应用。
* 其中一个复杂性增长的主要领域是管理我们应用的状态，因此为了避免这种复杂性，开发者使用了包含更新和获取 app 状态的库。最著名的例子是 redux，它是 flux 模式的一种应用。
* 一旦开发者开始学习使用像 redux 的库，他们可能不太了解库的内部运行机制，因为一开始这并不明显，即使很容易的知道了这是更新一个全局可用的对象这样的一个概念。
* 在这篇文章中，我们将会从零开始为 react 应用建立一个我们自己的状态管理解决方案。我们的解决方案最初只有几行代码，逐渐增加更高级的特性，最终将类似于 redux。

### 基本概念

* 任何状态管理工具只需要两件东西：对整个应用都可用的全局状态，和读取以及更新它的能力。只有这些，真的。
* 这里展示一个状态管理的简单例子：
```
const state = {};

export const getState = () => state;

export const setState = nextState => {
  state = nextState;
};
```
* 上面的例子已经尽可能的简单，但它仍然包含了所有的要素：
> 一个全局可用的用于展现我们应用状态的值：state；
>
> 读取状态的能力：getState；
>
> 更新状态的能力：setState。

* 上面的例子对于我们真实应用来说太过简单，因此接下来我们将要构建一个能让 react 可用的解决方案。首先我们来重构我们的例子，以让它在 react 中可用。

### react 状态管理

* 为了制作一个我们之前解决方案的 react 版本，我们需要应用两个 react 功能。第一个功能是普通经典类组件，也就是众所周知的有状态组件。
* 第二个功能是 context api，它可以让数据在整个 react 应用可用。context 有两部分：provider (生产者) 和 consumer (消费者)，provider 就像它的名字所说的那样，给应用提供 context (data 数据)，消费者意指当我们读取 context 时，我们就是消费者。
* 可以这样理解 context：如果说 props 是显式的传送数据，那么 context 就是隐式的传送数据。

### 建造我们自己的状态管理器

* 现在我们知道了需要哪些工具，现在只要把它们合在一起就可以了。我们准备创建一个上下文环境来存放全局状态，然后把它的 provider 包裹在一个有状态组件中，然后用 provider 来管理状态。

* 首先，我们使用 React.createContext 来创建上下文，它可以给我们提供 provider 和 consumer。

* ```javascript
  import { createContext } from 'react';
  
  const { Provider, Consumer } = createContext();
  ```

* 接下来我们需要用有状态组件包裹我们的 provider，利用它进行应用状态的管理。我们也应该把 consumer 导出为一个更加准确的名称。

* ```javascript
  import React, { Component, createContext } from 'react';
  
  const { Provider, Consumer } = createContext();
  
  export const StateConsumer = Consumer;
  
  export class StateProvider extends Component {
    static defaultProps = {
      state: {}
    };
  
    state = this.props.state;
  
    render () {
      return (
        <Provider value={this.state}>
          {this.props.children}
        </Provider>
      );
    }
  }
  ```

* 在上面的例子中，StateProvider 是接收一个 state 来作为初始状态的组件，并且使组件树中当前组件下面的任何组件都可以接触到这个属性。如果没有提供 state，默认会有一个空对象代替。

* 用我们的 StateProvider 包裹住根组件：

* ```javascript
  import { StateProvider } from './stateContext';
  import MyApp from './MyApp';
  
  const initialState = {
    count: 0
  };
  
  export default function Root () {
    return (
      <StateProvider state={initialState}>
        <MyApp />
      </StateProvider>
    );
  }
  ```

* 在我们完成上述代码之后，就可以作为一个消费者从 MyApp 的任何地方获得应用的状态。在这里我们会初始化我们的状态为一个有一个 count 属性的对象，所以无论什么时候我们想要立即获取应用的状态，我们就可以从这里获得。

* 消费者使用 [render 属性](https://reactjs.org/docs/render-props.html)来传递上下文数据，我们可以通过下面的一个函数作为 StateConsumer 的子组件的例子来查看。state 参数传递给函数用以展现我们应用的当前状态，作为我们的初始状态，state.count 为 0.

* ```javascript
  import { StateConsumer } from './stateContext';
  
  export default function SomeCount () {
    return (
      <StateConsumer>
        {state => (
          <p>
            Count: {state.count}
          </p>
        )}
      </StateConsumer>
    );
  }
  ```

* 关于 StateConsumer 我们需要知道的很重要一点是在上下文中它会自动订阅状态的改变，因此当我们的状态改变后会重新渲染以显示更新。这就是消费者的默认行为，我们暂时还没做能够用到这个特性的功能。

### 更新状态

* 目前为止我们已经可以读取应用的状态，以及在状态改变时自动更新。现在我们需要一种更新状态的方法，为了做到这一点我们仅仅只需要在 StateProvider 里面更新状态。

* 你之前可能已经注意到了，我们给 StateProvider 传递了一个 state 属性，也就是之后会传递给组件的 state 属性。我们将使用 react 内置的 this.setState 来更新：

* ```javascript
  export class StateProvider extends Component {
    static defaultProps = {
      state: {}
    };
  
    state = this.props.state;
  
    render () {
      return (
        <Provider value={{ state: this.state, setState: this.setState.bind(this) }}>
          {this.props.children}
        </Provider>
      );
    }
  ```

* 继续保持简单的风格，我们只给上下文传递 this.setState，这意味着我们需要稍微改变我们的上下文传值，不只是传递 this.state，我们现在同时传递 state 和 setState。

* 当我们用 StateConsumer 时可以用[解构赋值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)获取 state 和 setState，然后我们就可以读写我们的状态对象了：

* ```javascript
  export default function SomeCount () {
    return (
      <StateConsumer>
        {({ state, setState }) => (
          <>
            <p>
              Count: {state.count}
            </p>
            <button onClick={() => setState({ count: state.count + 1 })}>
              + 1
            </button>
            <button onClick={() => setState({ count: state.count - 1 })}>
              - 1
            </button>
          </>
        )}
      </StateConsumer>
    );
  }
  ```

* 有一点要注意的是由于我们传递了 react 内置的 this.setState 作为我们的 setState 方法，新增的属性将会和已有的状态合并。这意味着如果我们有 count 以外的第二个属性，它也会被自动保存。

* 现在我们的作品已经可以用在真实项目中了(尽管还不是很有效率)。对 react 开发者来说应该会觉得 api 很熟悉，由于使用了内置的工具因此我们没有引用任何新的依赖项。假如之前觉得状态管理有点神奇，希望现在我们多少能够了解它内部的结构。

### 华丽的点缀

* 熟悉 redux 的人可能会注意到我们的解决方案缺少一些特性：

* >* 没有内置的处理副作用的方法，你需要通过 [redux 中间件](https://redux.js.org/advanced/middleware)来做这件事
  >* 我们的 setState 依赖 react 默认的 this.setState 来处理我们的状态更新逻辑，当使用内联方式更新复杂状态时将可能引发混乱，同时也没有内置的方法来复用状态更新逻辑，也就是 [redux reducer](https://redux.js.org/basics/reducers)提供的功能。
  >* 也没有办法处理异步的操作，通常由 [redux thunk](https://github.com/reduxjs/redux-thunk) 或者 [redux saga](https://github.com/redux-saga/redux-saga)等库来提供解决办法。
  >* 最关键的是，我们没办法让消费者只订阅部分状态，这意味着只要状态的任何部分更新都会让每个消费者更新。

  * 为了解决这些问题，我们模仿 redux 来应用我们自己的 **actions**，**reducers**，和**middleware**。我们也会为异步 actions 增加内在支持。之后我们将会让消费者只监听状态内的子状态的改变。最后我们来看看如何重构我们的代码以使用新的 [**hooks api**](https://reactjs.org/docs/hooks-intro.html)。