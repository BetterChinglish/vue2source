import { createElement, createTextNode } from "./vdom/create-element";


export function renderMixin(Vue) {
  // _c 创建元素的虚拟节点
  // _v 文本
  // _s 表达式转化为string {{express}}
  Vue.prototype._c = function () {
    return createElement(...arguments);
  }
  
  Vue.prototype._v = function (text) {
    return createTextNode(text);
  }
  
  Vue.prototype._s = function (val) {
    // null返回空字符串
    // 对象则使用stringfy转为字符串, 基本量则直接展示
    return val === null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
  }
  
  Vue.prototype._render = function (params) {
    const vm = this;
    
    // 模板的render方法
    const { render } = vm.$options;
    render.call(vm);
  }
}