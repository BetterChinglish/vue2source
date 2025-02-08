import { isObject, isReservedTag } from "../utils";

export function createElement(vm, tag, data, children) {
  let key = data.key;
  if(key) {
    delete data.key;
  }
  
  // 原始标签处理直接返回生成的node
  if(isReservedTag(tag)) {
    return vnode(tag, data, key, children, undefined);
  }
  // 组件处理
  else {
    // Ctor: constructor，即子组件构造函数
    let Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, key, children, Ctor);
  }
}

// 创建子组件
function createComponent(vm, tag, data, key, children, Ctor) {
  // 如果是对象的话, 使用extend方法重新转化
  if(isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }
  
  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, {Ctor, children})
}

// 创建文本元素
export function createTextNode(vm, text) {
  return vnode(undefined, undefined, undefined, undefined, text);
}

// 标签名、属性数据、key、孩子节点、文本内容
function vnode(tag, data, key, children, text, componentOptions) {
  return {
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}