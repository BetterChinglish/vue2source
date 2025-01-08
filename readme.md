
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

注意刚刚案例中的renderStr的  `_v("name: " + _s(name) + "; age: " + _s(age))`, _s中的name与age是没有双引号的
```js
renderFunction.call(vm)
```

由此renderFn便生成完成
## 监听收集相关

