import {initState} from "./state";


export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 数据劫持
    const vm = this;
    
    vm.$options = options;
    
    // 初始化状态
    initState(vm);
    
    // 初始化事件
    
    // 初始化渲染
    
    // 调用beforeCreate钩子函数
    
  }
}