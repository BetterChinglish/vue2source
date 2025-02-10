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
  // 子组件处理
  else {
    // Ctor: constructor，即子组件构造函数, 即extend方法里设置的子组件的构造函数
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
  data.hook = {
    // 创建组件
    init(vnode) {
      // new Ctor，由于ctor基于Vue，其实还是走到_init()方法, 但是由于没有挂载节点,不会触发_init方法的mount
      let child = vnode.componentInstance =  new Ctor({_isComponent: true});
      // 手动mount
      child.$mount();
    },
    inserted() {
    }
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