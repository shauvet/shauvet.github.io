### 中间件

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

### 异步 action

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

