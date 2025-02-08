import { mergeOptions } from "../utils";


export default function (Vue) {
  // 创建子类 继承于父类， 拓展的时候将父组件的东西拓展到自己身上
  Vue.extend = function (extendOptions) {
    // 创建子类
    const Sub = function VueComponent(options) {
      // 使用Vue的_init初始化子组件类
      this._init(options);
    }
    Sub.prototype = Object.create(this.prototype);
    Sub.prototype.constructor = Sub;
    
    Sub.options = mergeOptions(this.options, extendOptions);
    
    // mxin use component
    // Sub.mixin = this.mixin;
    
    return Sub;
  }
}