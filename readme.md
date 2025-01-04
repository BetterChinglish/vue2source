
# vue源码学习

声明Vue方法
```js
function Vue(options) {
  this._init(options);
}
```

当实例化时会执行, 声明function Vue的时候无执行，所以无报错
```js
  this._init(options);
```

_init 来源：
```js
import { initMixin } from "./init";


function Vue(options) {
  this._init(options);
}

initMixin(Vue);

export default Vue;
```
其实是为了方便管理整个流程的顺序，使用方法在其原型上添加的_init方法
```js
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 数据劫持
    const vm = this;
    
    vm.$options = options;
    
    // 初始化状态
    initState(vm);
    
    // 如果传入了el属性，则挂载
    if(vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  
  }
 
}
```