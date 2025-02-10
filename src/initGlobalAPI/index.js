import initGlobalMixinApi from './mixin';
import { ASSETS_TYPE } from "../constant";
import initAssetRegisters from './assets';
import initExtend from './extend';



// 初始化全局生命周期方法
export function initGlobalAPI(Vue) {
  
  Vue.options = {};
  
  // 初始化全局api
  initGlobalMixinApi(Vue);

  // 初始化组件的子组件、过滤器、指令的存储对象
  ASSETS_TYPE.forEach(type => {
      Vue.options[type + 's'] = {};
  })

  // 构造函数放上
  Vue.options._base = Vue;


  // 注册extend方法，用于生成子组件
  initExtend(Vue);

  // 注册component、directive、filter方法
  initAssetRegisters(Vue);
  console.dir(Vue)



  
  // Vue.mixin({
  //   a: 1,
  //   mounted() {
  //     // console.log('mounted 1')
  //   }
  // })
  // Vue.mixin({
  //   b: 1,
  //   mounted() {
  //     // console.log('mounted 2')
  //   }
  // })
  // Vue.mixin({
  //   c: 1,
  //   mounted() {
  //     // console.log('mounted 3')
  //   }
  // })
  
  // console.log(Vue.options)
  
  
}