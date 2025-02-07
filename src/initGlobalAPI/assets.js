import { ASSETS_TYPE } from "../constant";

export default function (Vue) {
  ASSETS_TYPE.forEach(type => {
    Vue[type] = function (id, definition) {
      // 调用Vue.component('comp', {template: '<div>comp</div>'})生成子组件时的处理
      // 在当前Vue上注册组件、指令、过滤器
      if (type === 'component') {
        // 注册组件
        // 判断组件是否是对象，如果是对象则调用Vue.extend方法转换成构造函数
        // 此处的definition为Vue.component('comp', {template: '<div>comp</div>'})中的第二个参数，即组件的定义
        // 子组件也可能有这个方法，所以使用this.options._base定位到当前组件的构造函数上
        definition = this.options._base.extend(definition);

      }
      else if (type === 'directive') {
        // 注册指令
      }
      else if (type === 'filter') {
        // 注册过滤器
      }

      // 将生成的子组件放到Vue.options.components上，其中id为该组件的名称
      this.options[type + 's'][id] = definition
    }
  })
}