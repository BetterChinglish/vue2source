import Watcher from "./observer/watcher";


export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    
  }
}

// 挂载
// 先通过template编译出render方法，再从render方法生成虚拟dom，根据虚拟dom创建真实dom，然后渲染到页面上
export function mountComponent(vm, el) {
  const options = vm.$options;
  // 真实dom，用于挂载的节点
  vm.$el = el;
  
  // 渲染页面
  let updateComponent = () => { // 渲染或更新都使用此方法
    // 获取虚拟dom，需要去实现_c _v _s
    const virtualDom = vm._render();
    // 创建真实节点
    vm._update(virtualDom);
  }
  
  // 渲染watcher，每个组件都有一个watcher
  // true表示是一个渲染watcher
  new Watcher(vm, updateComponent, () => {}, true);
}
