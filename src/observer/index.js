
import {def, isObject} from '../utils';
import { arrayMethods } from './array';
import { Dep } from "./dep";

export function observe(data) {
  // 初次进来，是vm._data，是一个对象, 后续再进来可能是常量、对象、数组等
  if(!isObject(data)) {
    return;
  }
  
  return new Observer(data);
}

class Observer {
  
  constructor(data) {
    // 数组的处理
    // 数组不要对索引进行劫持，因为会导致性能问题
    if(Array.isArray(data)) {
      // 重写数组的方法，当修改数组的数据的时候也要能够劫持到
      // 让数组记住当前的observer实例
      def(data, '__ob__', this);
      // push、pop、shift、unshift、splice、sort、reverse
      data.__proto__ = arrayMethods;
      // 如果数组里放的是对象才监控
      this.observeArray(data);
    }
    // 对象的处理
    else {
      this.walk(data);
    }
  }
  
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]);
    })
  }
  
  // 这里的data前面已经判断过是数组了
  observeArray(data) {
    data.forEach(item => {
      // observe会判断是否为对象，如果是对象则继续递归劫持
      observe(item);
    })
  }
}

function defineReactive(data, key, value) {
  
  let dep = new Dep();
  
  // 如果value是对象，则继续递归劫持
  observe(value);
  Object.defineProperty(data, key, {
    // 这俩默认为true可以不写
    // configurable: true,
    // enumerable: true,
    get() {
      // console.log('取值');
      if(Dep.target) {
        dep.depend();
      }
      console.log(dep.subs)
      return value;
    },
    set(newValue) {
      // console.log('改值')
      if(newValue === value) {
        return;
      }
      // 直接将原有对象覆盖时，需要此行将新赋值的数据劫持
      observe(value);
      value = newValue
      dep.notify();
    }
  })
}

