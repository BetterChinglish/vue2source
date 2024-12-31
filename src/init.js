import {initState} from "./state";
import { compileToFunction } from "./compiler/index";
import { mountComponent } from "./lifecycle";

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
  
  Vue.prototype.$mount = function (el) {
    const vm = this;
    // id 唯一
    el = document.querySelector(el);
    
    // 获取真实dom
    const options = vm.$options;
    options.el = el;
    
    // 先查找有无render方法
    
    // 没有render采用template
    
    // 没有template直接使用el的内容
    
    // 如果没有render方法，则将模板转换为render函数
    if(!options.render) {
      // 取模板
      let template = options.template;
      // 没有template但是有el
      if(!template && el) {
        template = el.outerHTML;
      }
      
      // 将模板编译为render函数
      
      // 将template转化为render方法
      options.render = compileToFunction(template);
    }
    
    // 挂载
    mountComponent(vm, el);
  }
}