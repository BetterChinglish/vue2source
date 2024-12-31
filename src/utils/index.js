
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