# [译]高阶组件在 react hooks 中的应用

* 对于那些经常使用 react 的人来说，很难不遇到[高阶组件](https://reactjs.org/docs/higher-order-components.html)(或者 HoC's)。对于外行来说，它是一种让 react 组合本身以让代码可以复用到不同的组件的一直模式。即使你没有自己写过，也很有可能在你没有意识到的时候使用过它们。

* 常见的使用模式可以从连接项目工程与状态管理存储(例如： [redux](https://www.sohamkamani.com/blog/2017/03/31/react-redux-connect-explained/) 里面的 `connect`)到[条件渲染组件](https://github.com/acdlite/recompose/blob/master/docs/API.md#branch)或者我最喜欢的模式即赋予函数组件本地状态。

* 概念上来说，高阶组件是使用一些叫做增强器的函数包裹一个基础组件来组成的。增强器可以通过多种方式转换或者影响一个基础组件。这类似于 [map 函数](https://en.wikipedia.org/wiki/Map_%28higher-order_function%29)，可以对一组数据进行转换并生成一组新的数据。如果你仍然有一点困惑，可以看下这个例子：

* ```javascript
  // A simple component
  const HelloComponent = ({ name, ...otherProps }) => 
                            (<div {...otherProps} >
                                Hello {name}!
                             </div>);
  // An enhancer that will set a name prop on 
  // a base component to "New Name"
  const withNameOverride = BaseComponent => props =>
                               (<BaseComponent 
                                   {...props}
                                   name="New Name" 
                                />);
  // An enhancer that will apply some inline
  // styling to a base component
  const withStyling = BaseComponent => props =>
                              (<BaseComponent 
                                  {...props}
                                  style={{
                                          font-weight: 700, 
                                          color: 'green'
                                         }} 
                               />);
  // Higher Order Components
  const EnhancedHello1 = withNameOverride(HelloComponent);
  const EnhancedHello2 = withStyling(HelloComponent);
  const EnhancedHello3 = compose(withNameOverride, withStyling)HelloComponent);
  ```

* 在这个片段中，`HelloComponent` 是一个我们可以通过 `withNameOverride` 和/或者 `withStyling` 增强的组件。

* ```javascript
  <EnhancedHello1 name='World' /> 
  //becomes
  <div>Hello New Name</div>

  <EnhancedHello2 name='World' /> 
  //becomes
  <div style={{ fontWeight: 700,color: 'green' }}>Hello World</div>

  <EnhancedHello3 name='World' /> 
  //becomes
  <div style={{ fontWeight: 700,color: 'green' }}>Hello New Name</div>
  ```

* 这是一项简单的例子，展示了高阶组件是如何帮助我们写出高度组合性的代码。许多人想到[高阶组件](https://reactjs.org/docs/higher-order-components.html)的时候，很难不想到一个非常可靠的增强器的库，[Recompose](https://github.com/acdlite/recompose)。每周140多万次下载，完全可以说它是一个很流行的纯粹地由高阶组件开发的库。这足以说明高阶组件的一些最佳应用。

* 对许多 react 开发者来说，高阶组件是生态系统中必不可少的一部分。至少是在2018年10月之前，react 大会召开之前是这样的。在这次大会上 react 团队推出了 hooks。

* <iframe width="700" height="393" src="https://www.youtube.com/embed/wXLf18DsV-I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* 与 Recompose 的作者一起建造，hooks 被认为是各方面都比高阶组件更好的解决方案。甚至 Recompose 的作者更新了 [readme](https://github.com/acdlite/recompose#a-note-from-the-author-acdlite-oct-25-2018) 建议人们转到 hooks。

  >Hooks 解决了我三年前尝试使用 Recompose 解决的问题，不止如此。我将停止对此包 [Recompose] 的主动维护。 

* 这份声明强烈而且分裂了许多已经非常习惯使用 Recompose 的开发者(包括我自己)。我们已经使用高阶组件的可组合性开发了大量的应用，很难相信 hooks 能够神奇的全部替换掉它。这使我更加好奇是否仍然有在新的 react 开发中使用高阶组件的必要性。我列了几个我使用高阶组件的例子，以及他们如何在前 hooks 环境中叠加。

## 组件本地状态

* 我喜欢尽可能的写函数组件。类组件随着尺寸增长会变得越来越难以预测以及难以维护。Recompose 提供了一种增强器通过一种方式来组合本地状态和函数组件，这让我不必为了如何写组件而妥协。而 hooks 从一开始就是被设计用在函数组件内解决这种问题的，hooks 改变了游戏。[useState](https://reactjs.org/docs/hooks-reference.html#usestate) 钩子允许我所需要的所有状态管理逻辑，而且读写还非常简洁优雅。在之前的每一个使用 [withState](https://github.com/acdlite/recompose/blob/master/docs/API.md#withstate) 的地方我全都直接换成了 `useState`。

## 组件生命周期

* 又一次，hooks 赢了。[useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) 简化了在组件中增加副作用的必要的理解。跟 `componentDidMount` 和 `componentDidUpdate` 不同，在一个推迟的事件中，被传递给 `useEffect` 的函数在布局和绘图之后才会执行。这使得它很适合常见的副作用，如订阅 subscriptions 和事件处理器，因为大多数类型的工作不应该阻止浏览器更新屏幕。此外，`useEffect` 提供了一种简单的方式来编写简洁的代码，这有助于组件渲染中在下一次作用执行之前清理前一次的作用。Recompose 和 [withLifecycle](https://www.npmjs.com/package/@hocs/with-lifecycle) 提供了高阶组件的解法，但是没有提供 [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) 的简洁用法。我还没有达到这个生命周期高阶组件可以解决地更好的 hook 钩子的极限。

## 可测试性

* 早期让我倾向于高阶组件的一个原因是他们可以模块化。模块化使得它们对单元测试非常友好。然而，hooks 这玩意并非是激情过后的产物。hooks是很多人花很多精力创造出来的。其中之一就是[可测试性](https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks)。已经有正在积极维护的[很奇妙的库](https://github.com/mpeyper/react-hooks-testing-library)被用来测试 hooks。在这方面，两种模式在许多方面都是类似，然而，在某些方面可以证明这是必要的。

## 分支渲染

* 考虑下这种情况：

* 你有一个组件接收 `bar` 属性并且将它提供给一个函数，这个函数从一些请求返回 `{ results, loading, error }`。当 `loading` 被定义的时候，你需要渲染一个 loading 提示组件。当 `error` 被定义的时候，你需要渲染一个 error 组件。只有当 `loading` 和 `error` 都没有定义时，你才可以认为 `result` 是合法的。

* hooks 的实现看起来像这样(假设 `useRequest` 是一个使用 hooks 进行请求的非凡函数)：

* ```javascript
  export const Foo = ({ bar }) => {
    const { result, loading, error } = useRequest(bar);
    if (error) {
      return <ErrorComponent />;
    } else if (loading) {
      return <LoadingComponent />;
    }
    return <ResultComponent result={result} />;
  };
  ```

* 这初看起来挺合理的，但是如果我们不得不重复几十次不同的请求时是什么样呢？你可能会拷贝或粘贴这个条件块到每一个条件里面不同的应用，它可能需要在内部测试。

* 一个高阶组件实现可以像这样重组：

* ```javascript
  const Foo = ({ result }) => <ResultComponent result={result} />;
  const withRequest = BaseComponent => ({ bar, ...props }) => {
    const { result, loading, error } = useRequest(bar);
    return (
      <BaseComponent {...props} result={result} loading={loading} error={error} />
    );
  };
  const withError = branch(({ error }) => error, ErrorComponent);
  const withLoading = branch(({ loading }) => loading, LoadingComponent);
  export default compose(
    withRequest, 
    withLoading,
    withError
  )(Foo);
  ```

* 虽然它肯定有更多行，但是需要注意的是每个常量的模块性。[branch](https://github.com/acdlite/recompose/blob/master/docs/API.md#branch) 是一个来自 Recompose 的增强器，它接收一个测试函数和两个高阶组件。测试函数从所有者那里传递属性。如果它返回 true，那么 `left` 组件会被应用，否则，右边的组件会被应用。当我们把所有块组合起来时，表现跟之前一样。当我们考虑与以前相同的假设时，想想如何为数十个类似结构的请求测试，好处就变得明显了。我们需要测试一次 `withError` 和 `withLoading`，我们可以复用这个逻辑很多次，当我们仍然想维持相同的测试覆盖率而无需写新的测试用例。

## 属性转换

* 考虑下这种情况：

* 你有一个组件，接收一个 `foo` 属性，但是在被使用前要被转换为 `bar`。在咨询 Hooks API 的参考资料获取指导之后，我真的不知道 hooks 该如何解决这个问题(如果你正好指导如何使用 hooks 解决，请留言让我知道)。然而，这里有一个高阶组件的解决方案：

* ```javascript
  const Result = ({ bar }) => <ResultComponent result={bar} />;
  const withBar = BaseComponent => ({ foo, ...props }) => (
    <BaseComponent {...props} bar={transform(foo)} />
  );
  export default withBar(Result);
  ```

* 而且即使在这种情况下 `withProps` 也可以替换 `withBar` 的很多应用。然而，为清晰起见，我选择更加精确的方案。

## 总结

* 比较高阶组件和 hooks 是一个天真的争论。hooks 的确可以以更加优雅的方式解决一些我们曾经只能通过高阶组件（使用 recompose ）处理的大的挑战。然而，如果你走近看，明显的是高阶组件在 react 中仍然有用武之地。
* 在我的使用高阶组件的分支渲染的例子中，我试图使用同被使用在 hooks 的例子中相同的 `useRequest` 函数。你有注意到吗？在任何情况下它都是兼容的。这里的目的是为了表明 hooks 可以很好地处理很多像状态和生命周期的这样大的概念，但是使用它的代码也可以从高阶组件的可组合性和模块性中受益。

* Recompose 的作者关于 hooks 的声明绝对是大胆的，但不完全是事实。如果有的话，应该是这样：

  >Hooks 解决了许多我三年前试图用 Recompose 来解决的问题。由于这一点，一些工具现在不太有用了，因此我推荐大家看下 hooks。

* 那么回到文章的标题，Recompose 在 React Hooks  世界里的作用减少了，但是至少到目前为止，高阶组件仍然有用。