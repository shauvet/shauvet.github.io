# 开发类 redux 库来理解状态管理

> 对于想要直接看结果，跳过文章的人，我已经把我写的内容制作成了一个库：[use-simple-state](https://github.com/Jahans3/use-simple-state)，无任何依赖（除了依赖 react ），只有3kb，相当轻量。

* 近几年，应我们的 app 增长的需要，web 应用数量增长迅速，随之而来的还有复杂性。为了使增加的复杂性易于处理，应用某些新增的技巧和模式使得开发者可以更简单的处理以及帮助我们建立更加健壮的应用。
* 其中一个复杂性增长的主要领域是管理我们应用的状态，因此为了避免这种复杂性，开发者使用了包含更新和获取 app 状态的库。最著名的例子是 redux，它是 flux 模式的一种应用。
* 一旦开发者开始学习使用像 redux 的库，他们可能不太了解库的内部运行机制，因为一开始这并不明显，即使很容易的知道了这是更新一个全局可用的对象这样的一个概念。
* 在这篇文章中，我们将会从零开始为 react 应用建立一个我们自己的状态管理解决方案。我们的解决方案最初只有几行代码，逐渐增加更高级的特性，最终将类似于 redux。

## 基本概念

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

## react 状态管理

* 为了制作一个我们之前解决方案的 react 版本，我们需要应用两个 react 功能。第一个功能是普通经典类组件，也就是众所周知的有状态组件。
* 第二个功能是 context api，它可以让数据在整个 react 应用可用。context 有两部分：provider (生产者) 和 consumer (消费者)，provider 就像它的名字所说的那样，给应用提供 context (data 数据)，消费者意指当我们读取 context 时，我们就是消费者。
* 可以这样理解 context：如果说 props 是显式的传送数据，那么 context 就是隐式的传送数据。

## 建造我们自己的状态管理器

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

## 更新状态

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

## 华丽的点缀

* 熟悉 redux 的人可能会注意到我们的解决方案缺少一些特性：

  >* 没有内置的处理副作用的方法，你需要通过 [redux 中间件](https://redux.js.org/advanced/middleware)来做这件事
  >* 我们的 setState 依赖 react 默认的 this.setState 来处理我们的状态更新逻辑，当使用内联方式更新复杂状态时将可能引发混乱，同时也没有内置的方法来复用状态更新逻辑，也就是 [redux reducer](https://redux.js.org/basics/reducers)提供的功能。
  >* 也没有办法处理异步的操作，通常由 [redux thunk](https://github.com/reduxjs/redux-thunk) 或者 [redux saga](https://github.com/redux-saga/redux-saga)等库来提供解决办法。
  >* 最关键的是，我们没办法让消费者只订阅部分状态，这意味着只要状态的任何部分更新都会让每个消费者更新。

* 为了解决这些问题，我们模仿 redux 来应用我们自己的 **actions**，**reducers**，和**middleware**。我们也会为异步 actions 增加内在支持。之后我们将会让消费者只监听状态内的子状态的改变。最后我们来看看如何重构我们的代码以使用新的 [**hooks api**](https://reactjs.org/docs/hooks-intro.html)。

## redux 简介

> 免责声明：接下来的内容只是为了让你更容易理解文章，我强烈推荐你阅读 [redux 官方](https://redux.js.org/introduction/motivation)完整的介绍。
>
> 如果你已经非常了解 redux，那你可以跳过这部分。

* 下面是一个 redux 应用的数据流简化流程图：

![redux-data-flow](../statics/imgs/redux-data-flow.png)

* 如你所见，这就是单向数据流，从我们的 reducers 接收到状态改变之后，触发 actions，数据不会回传，也不会在应用的不同部分来回流动。

* 说的更详细一点：

* 首先，我们触发一个描述改变状态的 action，例如 `dispatch({ type: INCREMENT_BY_ONE })`来加1，同我们之前不同，之前我们是通过 `setState({ count: count + 1 })`来直接改变状态。

* action 随后进入我们的中间件，redux 中间件是可选的，用于处理 action 副作用，并将结果返回给 action，例如，假如在 action 到达 reducer 之前触发一个`SIGN_OUT`的 action 用于从本地存储里删除所有用户数据。如果你熟悉的话，这有些类似于 [express](https://expressjs.com/) 中间件的概念。

* 最后，我们的 action 到达了接收它的 reducer，伴随而来的还有数据，然后利用它和已有的状态合并生成一个新的状态。让我们触发一个叫做 `ADD` 的 action，同时把我们想发送过去增加到状态的值也发送过去(叫做 payload )。我们的 reducer 会查找叫做 `ADD` 的 action，当它发现后就会将 payload 里面的值和我们现有的状态里的值加到一起并返回新的状态。

* reducer 的函数如下所示：

* ```javascript
  (state, action) => nextState
  ```

* reducer 应当只是处理 state 和 state ，虽然简单却很强大。关键是要知道 reducer 应当永远是纯函数，这样它们的结果就永远是确定的。

## actions + dispatch

* 现在我们已经过了几个 redux app 的关键部分，我们需要修改 app 来模仿一些类似的行为。首先，我们需要一些 actions 和触发它们的方法。

* 我们的 action 会使用 action 创建器来创建，它们其实就是能生成 action 的简单函数，action 创建器使得测试，复用，传递 payload 数据更加简单，我们也会创建一些 action type，其实就是字符串常量，为了让他们可以被 reducer 复用，因此我们把它存储到变量里：

* ```javascript
  // Action types
  const ADD_ONE = 'ADD_ONE';
  const ADD_N = 'ADD_N';
  
  // Actions
  export const addOne = () => ({ type: ADD_ONE });
  export const addN = amount => ({ type: ADD_N, payload: amount });
  ```

* 现在我们来做一个 `dispatch` 的占位符函数，我们的占位符只是一个空函数，将会被用于替换上下文中的 `setState` 函数，我们一会再回到这儿，因为我们还没做接收 action 的 reducer 呢。

* ```javascript
  export class Provider extends React.PureComponent {
    static defaultProps = {
      state: {}
    };
  
    state = this.props.state;
  
    _dispatch = action => {};
  
    render () {
      return (
        <StateContext.Provider value={{ state: this.state, dispatch: this._dispatch }}>
          {this.props.children}
        </StateContext.Provider>
      );
    }
  }
  ```

## reducers

* 现在我们已经有了一些 action，只需要一些 reducer 来接收就好了。回到之前的 reducer 函数标记，它只是一个关于 action 和 state 的纯函数：

* ```javascript
  (state, action) => nextState
  ```

* 知道了这个，我们只需要传递组件的状态，然后在 reducer 里触发 action。对 reducer 来说，我们只想要一个对应上面标记的函数数组。我们使用一个数组，这样就可以使用数组的 `Array.reduce` 方法来迭代数组，最终生成我们的新状态：

* ```javascript
  export class Provider extends React.PureComponent {
    static defaultProps = {
      state: {},
      reducers: []
    };
  
    state = this.props.state;
  
    _dispatch = action => {
      const { reducers } = this.props;
      const nextState = reducers.reduce((state, reducer) => {
        return reducer(state, action) || state;
      }, this.state);
  
      this.setState(nextState);
    };
  
    render () {
      return (
        <StateContext.Provider value={{ state: this.state, dispatch: this._dispatch }}>
          {this.props.children}
        </StateContext.Provider>
      );
    }
  }
  ```

* 如你所见，我们所做的就是使用 reducer 来计算并获得新状态，然后就像之前所做的，我们调用 `this.setState` 来更新 `StateProvider` 组件的状态。

* 现在我们只需要一个实际的 reducer：

* ```javascript
  function countReducer ({ count, ...state }, { type, payload }) {
    switch (type) {
      case ADD_N:
        return { ...state, count: count + payload };
      case ADD_ONE:
        return { ...state, count: count + 1 };
    }
  }
  ```

* 我们的 reducer 只是检查传入的 `action.type`，然后假如匹配到之后将会更新相对应的状态，否则就会在经过 `switch` 判断语句之后返回函数默认的 `undefined`。我们的 reducer 和 redux 的 reducer 的一个重要的区别在当我们不想更新状态时，一般情况下我们会因为未匹配到 action type 而返回一个[falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 值，而 redux 则会返回未变化的状态。

* 然后把我们的 reducer 传进 `StateProvider`:

* ```javascript
  export default function Root () {
    return (
      <StateProvider state={initialState} reducers={[countReducer]}>
        <MyApp />
      </StateProvider>
    );
  }
  ```

* 现在我们终于可以触发一些 action，然后就会观察到相对应的状态更新：

* ```javascript
  export default function SomeCount () {
    return (
      <StateConsumer>
        {({ state, dispatch }) => (
          <>
            <p>
              Count: {state.count}
            </p>
            <button onClick={() => dispatch(addOne())}>
              + 1
            </button>
            <button onClick={() => dispatch(addN(5))}>
              + 5
            </button>
            <button onClick={() => dispatch(addN(10))}>
              + 10
            </button>
          </>
        )}
      </StateConsumer>
    );
  
  ```
## 中间件

* 现在我们的作品已经跟 redux 比较像了，只需要再增加一个处理副作用的方法就可以。为了达到这个目的，我们需要允许用户传递中间件函数，这样当 action 被触发时就会被调用了。
* 我们也想让中间件函数帮助我们处理状态更新，因此假如返回的 `null` 就不会被 action 传递给 reducer。redux 的处理稍微不同，在 redux 中间件你需要手动传递 action 到下一个紧邻的中间件，假如没有使用 redux 的 `next` 函数来传递，action 将不会到达 reducer，而且状态也不会更新。

* 现在让我们写一个简单的中间件，我们想通过它来寻找 `ADD_N` action，如果它找到了那就应当把 `payload` 和当前状态里面的 `count` 加和并输出，但是阻止实际状态的更新。
```javascript
function countMiddleware ({ type, payload }, { count }) {
  if (type === ADD_N) {
    console.log(`${payload} + ${count} = ${payload + count}`);
    return null;
  }
}
```
* 跟我们的 reducer 类似，我们会将中间件用数组传进我们的 `StateProvider`。

* ```javascript
  export default function Root () {
    return (
      <StateProvider
        state={initialState}
        reducers={[countReducer]}
        middleware={[countMiddleware]}
      >
        <MyApp />
      </StateProvider>
    );
  }
  ```

* 最终我们会调用所有所有中间件，然后根据返回的结果决定是否应当阻止更新。由于我们传进了一个数组，然而我们需要的是一个单个值，因此我们准备使用 `Array.reduce` 来获得我们的值。跟 reducer 类似，我们也会迭代数组依次调用每个函数，然后将结果赋值给一个变量 `continueUpdate`。

* 由于中间件被认为是一个[高级特性](https://redux.js.org/advanced)，因此我们不想它变成强制性的，因此如果没有在`StateProvider` 里面找到 `middleware` 属性，我们会将 `continueUpdate` 置为默认的 `undefined`。我们也会增加一个 `middleware` 数组来作默认属性，这样的话 `middleware.reduce` 就不会因为没传东西而抛出错误。

* ```javascript
  export class StateProvider extends React.PureComponent {
    static defaultProps = {
      state: {},
      reducers: [],
      middleware: []
    };
  
    state = this.props.state;
  
    _dispatch = action => {
      const { reducers, middleware } = this.props;
      const continueUpdate = middleware.reduce((result, middleware) => {
        return result !== null ? middleware(action, this.state) : result;
      }, undefined);
  
      if (continueUpdate !== null) {
        const nextState = reducers.reduce((state, reducer) => {
          return reducer(state, action) || state;
        }, this.state);
  
        this.setState(nextState);
      }
    };
  
    render () {
      return (
        <StateContext.Provider value={{ state: this.state, dispatch: this._dispatch }}>
          {this.props.children}
        </StateContext.Provider>
      );
    }
  }
  ```

* 如你所见在第13行，我们会查看中间件函数的返回值。如果返回 `null` 我们就会跳过剩下的中间件函数，`continueUpdate` 将为 `null`，意味着我们会中断更新。

## 异步 action

* 因为我们想让我们的状态管理器对真实生产环境有用，所以我们需要增加对异步 action 的支持，这意味着我们将可以处理像网络请求类似案例的通用任务。我们借鉴下 [Redux Thunk](https://github.com/reduxjs/redux-thunk) ，因为它的 API 很简单，直观而且有效。

* 我们所要做的就是检查是否有为被调用的函数被传递到 dispatch，如果找到的话我们就会在传递 `dispatch` 和 `state` 时调用函数，这样就可以给用户所写的异步 action 执行的机会。拿这个授权 action 作为例子来看下：

* ```javascript
  const logIn = (email, password) => async dispatch => {
    dispatch({ type: 'LOG_IN_REQUEST' });
  
    try {
      const user = api.authenticateUser(email, password);
      dispatch({ type: 'LOG_IN_SUCCESS', payload: user });
    catch (error) {
      dispatch({ type: 'LOG_IN_ERROR', payload: error });
    }
  };
  ```

* 在上面的例子中我们写了一个叫做 `logIn` 的 action 创建器，不是返回一个对象，它返回一个接收 `dispatch` 的函数，这可以让用户在一个异步 API 请求的前面和后面触发异步 action，根据 API 不同的返回结果触发不同的 action，这里我们在发生错误时发送一个错误 action。

* 做到这一点只需要在 `StateProvider` 里的 `_dispatch` 方法里检查 `action` 的类型是不是 `function`:

* ```javascript
  export class StateProvider extends React.PureComponent {
    static defaultProps = {
      state: {},
      reducers: [],
      middleware: []
    };
  
    state = this.props.state;
  
    _dispatch = action => {
      if (typeof action === 'function') {
        return action(this._dispatch, this.state);
      }
      
      const { reducers, middleware } = this.props;
      const continueUpdate = middleware.reduce((result, middleware) => {
        return result !== null ? middleware(action, this.state) : result;
      }, undefined);
  
      if (continueUpdate !== null) {
        const nextState = reducers.reduce((state, reducer) => {
          return reducer(state, action) || state;
        }, this.state);
  
        this.setState(nextState);
      }
    };
  
    render () {
      return (
        <StateContext.Provider value={{ state: this.state, dispatch: this._dispatch }}>
          {this.props.children}
        </StateContext.Provider>
      );
    }
  }
  ```

* 这里需要注意两点：我们调用 `action` 为函数，传入 `this.state`，这样用户可以访问异步 action 中已有的状态，我们也会返回函数调用的结果，允许开发者从他们的异步 action 中获得一个返回值从而开启更多的可能性，例如从 `dispatch` 触发的 promise 链。

