

// 重写会改变数组本身的方法：push、pop、shift、unshift、splice、sort、reverse
let oldArrayMethods = Array.prototype;

// 创建一个新的对象，继承自oldArrayMethods
export let arrayMethods = Object.create(oldArrayMethods);


const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

methods.forEach(method => {
  // 添加自定义的方法
  arrayMethods[method] = function (...args) {
    // 调用原生的数组方法
    const result = oldArrayMethods[method].apply(this, args);
    
    let inserted;
    
    // this即为调用该方法的数组
    let ob = this.__ob__;
    
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // splice方法的第三个参数是插入的元素
        inserted = args.slice(2);
        break;
    }
    
    if(inserted) {
      ob.observeArray(inserted);
    }
    
    // 发生改变通知watcher
    ob.dep.notify();
    // 原生返回作为重写返回
    return result;
  }
})