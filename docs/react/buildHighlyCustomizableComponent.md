#  如何编写高定制化的 React 组件

在大多数情况下，使用 React 构建的 web 应用大部分都是通过组件组合成用户的界面的。但是有些组件是在整个应用中重复使用的，例如：`Button`, `Link`, `Dropdown`, `Tooltip` 等。

对大型项目来说，所有这些组件都遵循一种通用的设计指南。跟其他 React 组件一样，你可以从设计指南中挑选组件然后使用在任意地方，但它们需要一个特别的功能 -- 定制。

不论设计指南是如何严格，你都不能指望同样类型的按钮能被用在任何地方。总会基于场景需要做一些改变的。当你想要为一个组件写一个独立的模块时，这个问题变得更加明显了。

定制能力允许对它们进行修改，不论是视觉层面还是功能层面，适配多种多样的使用场景。本文列举了一些使你的 React 组件高度定制的核心点。跟着这份指南，我将使用一个 `Dropdown` 组件来列举一些例子。

> 注意：不需要让所有的组件都做到如此可定制。对于那些不会到处用的组件可以简单点。

## 1. 定义边界

首先，你应该决定组件的预期。试着回答以下问题：

* 组件的作用是什么？
* 输入是什么？
* 输出是什么？
* 组件有没有副作用？
* 依赖是什么？
* 组件不应该做什么？

在这个练习的结尾，你应该有一个组件的黑盒子演示。

![black box](https://miro.medium.com/max/1400/1*mwDOjebapHpXPXJ6DcaK8A.png)

定义好边界可以让你做出关于组件使用假设的结构化决策。

## 2. 简单使用

永远要让组件易于开始使用 -- 对用户来说最小化或者无输入。它应该可以最快地解决最简单的使用场景。在 dropdown 的使用场景中，这里有一个最简单的使用方法：

```js
const options = [{id: 1, label: 'opt 1'}, {id:2, label:'opt 2'}];
<Dropdown options={options} onClick={e => console.log(e)} />
```

对于那些正在制作原型或评估组件以供进一步使用的用户来说这很容易，对于初学者也很有帮助。

确保安装过程简单和标准。你不能指望用户破例或者增加 polyfill 才能使用组件。

## 3. 基础定制

用户期望组件能支持一些简单的改变。例如，互动元素很常见的一个需求是支持 `disabled` 属性。为了找到基本的定制选项，很容易想到两大类：

### 3.1 功能改变

这会影响组件的行为。仔细考虑想让用户做出哪些改变。或许不需要在简单组件上支持功能变化，但是对于复杂组件，例如 `Select dropdown` 组件支持一个 `multiselect` 属性来支持多选。

* 使用黑盒子来分辨哪些是功能性变化是需要的。
* 对于每个功能变化，确认是组件的职责还是用户的职责。

### 3.2 样式改变

这会影响组件的外观。你不能假设任意样式，应该给予用户最大程度的定制能力。

跟随几个策略可以让组件容易改变样式：

* 简单 props：支持可选属性，例如：`size` , `align` , `disabled` 等等能让用户做出快速调整的。
* CSS classes：如果你的代码全部使用 class，用户可以轻易使用 class 规则来覆写。确保 class 名称直观和易于理解。
* 避免在你的 css 中使用 `!important` 和多个组合样式。因为很难覆写例如下面这样的代码：`.dropdown > .option > button > span` 。

## 4. 渲染器和组件

目标是为了让用户可以非常容易的使组件适配他们的使用场景。多数情况下，都是 UI 层面的变化，改变外观，增加不同的样式，等等。为了达到这一点，我分成 `components` 和 `renders` 两个模块。

具体到 dropdown，这里是我分的模块：

* Option: `OptionComponent` 和 `OptionRender`
* Trigger: `TriggerComponent` 和 `TriggerRender`
* Menu: `MenuComponent` 和 `MenuRender`

### 4.1 渲染器

渲染器只关心组件看起来什么样以及哪些其他条目需要显示。它附加了所有 css 样式，以及接受最低限度的属性来显示，如果用户想使用他们自定义的组件，他们可以直接传递自定义的 `render` 属性。

### 4.2 组件

这里处理指定模块的业务逻辑，例如事件处理，refs，角色，等等。只有容器没有任何样式。这种抽象从渲染器分离了逻辑，这样用户就可以在不影响功能的前提下替换渲染器。那些想要完全控制的高级用户，可以直接替换组件为他们自己的任意组件。

这种分离提升了更快的变化以及模块化代码，也提升了代码的可测试性。

```js
/**
 * Default trigger renderer - 显示一个普通按钮
 */
function TriggerRenderer(props) {
  return (
    <button className='trigger-renderer' disabled={props.disabled}>
      {props.label}
    </button>
  );
}
/**
 * Default trigger component - 渲染一个 div 和所有的处理
 */
function Trigger(props) {
  const Renderer = props.renderer || TriggerRenderer;

  return (
    <div
      ref={props.triggerRef}
      role='button'
      onClick={props.onClick}
    >
      <Renderer disabled={props.disabled} label={props.label} />
    </div>
  );
}

/**
 * 用户可以直接替换整个组件
 */
function Parent(props) {
  const TriggerElement = props.triggerComponent || Trigger;

  return (
     <TriggerElement
      {...props}
      renderer={props.triggerRenderer}
    />
  );
}
```

## 5. 自定义属性

组件将渲染特定的 HTML 元素，这些元素有你编写的属性。

但也应该允许用户传递自定义的属性给这些 HTML 元素。比如有人想添加额外的事件处理器或者像 `aria` 等你没有添加的标记。

```js
function Trigger(props) {
  return (
    <div
      onClick={props.onClick}
      {...props.customTriggerProps}
    >
      Text
    </div>
  );
}
```

## 6. 轻量化

接受一个第三方 React 组件的一大障碍是它的体积。如果组件会增加 40KB ，那组件就很有可能被弃用，即使它能提供更好的功能。

一些保持打包体积减少的策略：

* 压缩和/或混淆生产包文件
* 确保所有父级依赖例如 `React` 和 `ReactDOM` 被列在 `package.json` 文件的 `peerDependencies` 中
* 如果组件有很多变体或子级组件，允许部分导入，例如 `import subComp from package/subComp`
* 保持依赖的第三方库减少到最少数量

## 7. 易用性

在现代的 web 应用中，只完成功能是不够的，你也需要特别注意易用性。

### 7.1 键盘

组件应该可以使用键盘操作。这意味着使用正确类型的 HTML 标签(例如：`button` 和 `a` 标签用于交互)，在自定义部件的情况下处理焦点。

也可以决定自己处理 JavaScript 中的键盘事件。你可能会错过某些浏览器的默认行为和键盘聚焦相关的其它好处。

### 7.2 屏幕阅读

对于使用屏幕阅读器的人来说，组件为他们增加额外的信息很关键。包括 `alt`， `role`, `aria` 和其他属性。参考 React 文档[易用性指导](https://reactjs.org/docs/accessibility.html)以供进一步使用。

## 8. 拒绝非标准语法

使用现代 JavaScript 语法很诱人而且会使你的代码看起来简洁又漂亮。但这可能不是一个好主意，因为：

* 浏览器支持 & 转译：老浏览器不支持最新的语法，然后你不得不转译代码以适配
* 打包体积：转译将会增加文件打包体积而且可能还会对性能有不利影响
* 用户限制：假设支持现代语法/特性将会阻止那些没有同样条件不得不适配老浏览器的开发者使用

## 9. 加强使用指导

那些不知道组件是如何以及为什么编写的人很容易瞎用。作为开发者，你需要澄清信息以及推广正确的用法：

* 组件设计：我们以 dropdown 为例，你可以选择传递一个对象数组作为 options 作为组件的 children

```js
// 方法 1
const options = [{id: 1, label: 'opt 1'}, {id:2, label:'opt 2'}];
<Dropdown options={options} onClick={e => console.log(e)} />
// 方法 2
<Dropdown>
  <Option id='1'>opt 1</Option>
  <Option id='2'>opt 2</Option>
</Dropdown>
```

你的代码可能只期待 `Option` 作为 children，但是用户却可能传递其它东西，这样就会让组件报错。一个错误用法如下：

```js
// 可能让组件崩溃的错误示范
<Dropdown>
  <div class='section-1'>
    <Option id='1'>opt 1</Option>
    <Option id='2'>opt 2</Option>
  </div>
  <div class='section 2'>
    <Option id='1'>opt 1</Option>
    <Option id='2'>opt 2</Option>
  </div>
</Dropdown>
```

你应当决定组件的最佳使用方式，然后推广用户按照这种方式使用。

* Proptypes：[React proptypes](https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes) 是一种很好的检查类型的方式，可以用来检查组件传递进来的 props，阻止用户犯这种基础错误。
* 文档：这是最简单的向用户说明的一种方式了。高亮说明组件的用途，附带组件的使用范例。
* 测试用例提供了一种告诉用户什么应该做和什么不应该做的很好的参考。

## 总结

总的来说，我试着强调几种编写可定制的 React 组件的方式。然而，具体如何定制取决于使用场景以及试图解决什么问题。你应当评估并决定哪个功能才是合理的。



> 原文地址 [Building highly customizable React components](https://medium.com/better-practices/building-highly-customizable-react-components-838df56ff575)


