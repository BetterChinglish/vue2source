import { observe } from "./observer";


export function initState(vm) {
  console.log(vm)
  
  
  const opts = vm.$options;
  
  // 属性、方法、数据、计算属性、watch
  if(opts.props) {
    initProps(vm);
  }
  
  if(opts.method) {
    initMethod(vm);
  }
  
  if(opts.data) {
    initData(vm);
  }
  
  if(opts.computed) {
    initComputed(vm);
  }
  
  if(opts.watch) {
    initWatch(vm);
  }
}

function initProps() {}

function initMethod() {}

function initData(vm) {
  let data = vm.$options.data;
  
  // data可能是函数，也可能是对象, 如果是函数则调用函数且将this指向vm
  // 同时将data赋值给vm._data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  
  // 数据代理
  observe(data);
  
  
  console.log(vm)
}

function initComputed() {}

function initWatch() {}
