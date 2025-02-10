
[toc]

# vue源码学习

## 讲前须知

### 构造函数
js方法作为构造函数也就是new myFunction这种操作时，会生成一个对象，并将this指向这个对象
```js
let target;
function Person(name, age) {
    this.name = name;
    this.age = age;
    target = this;
}
let person1 = new Person('zhangsan', 14);
console.log(person1 === target)
```
### 原型链
prototype 与 proto

### this指向
箭头函数确定
一般function谁调用指向谁

## 由template到html的ast语法树
```html
<div
  id="app"
  style="color:red;font-size:14px;background-color: blue;"
  class="test-class"
>
  name: {{name}}; age: {{age}}
  <p>test</p>
  <div>{{message}}</div>
</div>
<script src="/dist/umd/vue.js"></script>
<script>
let vm = new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!',
      name: 'zhangsan',
      age: 18,
      addressInfo: {
        city: 'beijing',
        street: 'chaoyang'
      },
      scores: [100, 90, 80, {
        chinese: 100,
        math: 90,
        english: 80
      }],
    }
  }
})
</script>
```

转为html的ast语法树其实就是解析根div，将其转化为类似下面的结构，以用于后续的render方法的构造
```js
const root = {
  tag: 'div',
  nodeType: 1,
  text: "",
  data: {
    id: "app",
    style: {
      color: "red",
      fontSize: "14px",
      backgroundColor: "blue"
    },
    class: "test-class"
  },
  children:[
    {
      tag: "",
      nodeType: 3,
      text: "name: {{name}}; age: {{age}}",
      data: {},
      children: [],
    },
    {
      tag: "p",
      // ....
    }
  ]
}
```

常见的思路就是使用栈读取开始标签入栈, 遇到对应的闭合标签时弹出，

配合正则，对字符串步进匹配即可

## 由html的ast语法树到render方法
生成render方法, 他的操作就是根据上一步生成的对象root，生成一个可执行的字符串renderStr

可以先理解为生成一段可执行的代码字符串，类似eval()

递归root, 生成类似如下字符串
```js
renderStr = `_c(
  "div",
  {"id": "app","style": {"color": "red","fontSize": "14px","backgroundColor": "blue"},"class": "test-class"},
  _v("name: " + _s(name) + "; age: " + _s(age)),
  _c("p", null, _v("test")),
  _c(...)
)`
```
由上可见三个方法_c _v _s

- _c 用于生成元素节点
- _v 用于生成文本节点
- _s 用于访问vm示例获取元素值并转为字符串

由上可见_c入参的三个部分
- tagName
- attributes
- children nodes

这样就将template转为了一个renderStr，再将其转化为方法直接执行，这样我们只需要实现三个方法_c _v _s即可自动生成根元素
```js
const renderFunction = new Function(`with(this){${renderStr}}`)
```
通过with(this)，以及重定向this的call或apply或bind，可以将renderStr中的命名空间修改到vm上，这样_s就能直接访问到元素
```js
renderFunction.call(vm)
```
注意刚刚案例中的renderStr的  `_v("name: " + _s(name) + "; age: " + _s(age))`

_s中的name与age是没有双引号的，也就是说他们将被以变量的方式解析出来后再传入_s方法

由此renderFn便生成完成


## 响应式原理相关
render方法生成完成, 执行完后得到新dom替换页面挂载节点, 便完成了首次渲染

但响应式还没有实现

响应式的实现依赖两个类
- Dep
- Watcher

在执行render之前，为这个vm实例new一个watcher，并使用Dep.target暂时指向这个watcher
```js

// 将render交给watcher执行
new Watcher(vm.render)

// 简化的watcher
class Watcher{
  constructor(render) {
    this.render = render;
    this.get();
  }
  
  get() {
    // 用Dep.target存储这个watcher
    Dep.target = this;
    // 执行render
    this.render();
    // 置为null
    Dep.target = null;
  }
}
```

那么watcher就相当于对应一个vm的渲染

那就简单了，当这个vm里的某个属性发生改变的时候，我们再执行这个watcher的render，那么vm对应的dom就刷新了

对vm的data的属性进行observe重写的时候，我们重定义属性的get与set, 并为这个属性创建一个dep
```js
function defineReactive(data, key, value) {
  let dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      if(Dep.target) {
        dep.depend();
      }
      return value;
    },
    set(newValue) {
      value = newValue
      dep.notify();
    }
  })
}
```

结合首次执行render的代码
```js
    // 用Dep.target存储这个watcher
    Dep.target = this;
    // 执行render
    this.render();
    // 置为null
    Dep.target = null;
```
Dep.target先赋值这个vm的watcher

然后执行render

render执行的时候会执行_s方法, 期间会访问vm的data属性, 也就是属性的get方法被触发
```js
Object.defineProperty(data, key, {
    get() {
      // 存了个watcher
      if(Dep.target) {
        // 保存这个watcher
        dep.depend();
      }
      return value;
    }
  })
```
这个属性的dep会将watcher存下来

然后页面渲染完成

Dep.target = null

随后我们在页面操作, 引起vm的data发生改变

触发属性的set方法
```js
set(newValue) {
  value = newValue
  dep.notify();
}
```

执行dep.notify(), 去通知所有存下来的watcher重新执行render方法刷新页面

如上是vue2响应式的基本原理。



## diff

采用双缓存策略，即生成一个新的vnode，然后与老的vnode进行比较

采用同层比较，即只比较同一层级的节点，不跨层级比较


### tag是否相同

不同直接使用新的vnode生成新元素替换旧元素

相同则继续比较

### 文本是否相同
如果tag相同但是都是文本节点，则需要对比文本是否相同

如果文本不同则将新的vnode的文本替换掉老元素的textContent


### 属性是否相同

如果tag相同且都是元素节点，则需要对比属性是否相同

如果属性不同则将新的vnode的属性替换掉老元素的属性

对于style与class属性，需要特殊处理

