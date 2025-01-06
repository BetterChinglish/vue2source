
export function isObject(data) {
  return typeof data === 'object' && data !== null
}

export function def(data, key, value) {
  Object.defineProperty(data, key, {
    value,
    // 不可枚举 不可修改
    enumerable: false,
    configurable: false
  })
}

export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    }
  })
}

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destoryed',
]

const strategy = {};

LIFECYCLE_HOOKS.forEach(hookName => {
  strategy[hookName] = mergeHook;
})

function mergeHook(parentVal, childVal) {
  // 全搞成数组
  if(childVal) {
    if(parentVal) {
      return Array.isArray(parentVal) ? [...parentVal, childVal] : [parentVal, childVal];
    } else {
      return [childVal]
    }
  } else {
    return Array.isArray(parentVal) ? parentVal : [parentVal]
  }
}

export function mergeOptions(parent, child) {
  const options = {};
  
  [...new Set([...Object.keys(parent), ...Object.keys(child)])].forEach(key => {
    if(strategy[key]) {
      options[key] = strategy[key](parent[key], child[key])
      return;
    }
    // 这下面的都不太重要，因为vue2选项式api都是使用固定的几个属性, 只做最后的基本合并策略
    // 两者均有这个属性
    if(parent.hasOwnProperty(key) && child.hasOwnProperty(key)) {
      // 同种数据类型
      if(parent[key].constructor === child[key].constructor) {
        // 都是数组，不太确定怎么处理，暂时合并
        if(Array.isArray(parent[key])) {
          options[key] = [...parent[key], ...child[key]];
        } 
        // 都是对象
        else if(parent[key] instanceof Object) {
          options[key] = {
            ...parent[key],
            ...child[key]
          }
        }
        // 都有这个属性且类型一样，可能都为方法或数字，那么直接取孩子的
        else {
          options[key] = child[key];
        }
      }
      // 两者均有但不是同一种类型的数据，则直接使用child的
      else {
        options[key] = child[key];
      }
    }
    // 原有 mixin无
    if(parent.hasOwnProperty(key) && !child.hasOwnProperty(key)) {
      options[key] = parent[key];
    }
    // 原无 mixin有
    if(!parent.hasOwnProperty(key) && child.hasOwnProperty(key)) {
      options[key] = child[key];
    }
    // 两者均无这个属性----不存在这种情况
  })
  
  return options;
}