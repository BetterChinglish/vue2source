import initGlobalMixinApi from './mixin';
// 初始化全局生命周期方法
export function initGlobalAPI(Vue) {
  
  Vue.options = {};
  
  // console.dir(Vue);
  
  // 初始化全局api
  initGlobalMixinApi(Vue);



  
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