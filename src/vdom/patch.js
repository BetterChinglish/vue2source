

// 对vnode递归创建真实dom，并替换掉老的oldVnode
export function patch(oldVnode, vnode) {
  // vm.$el, 子组件生成时无, 即没有oldVnode
  if(!oldVnode) {
    // 子组件在_update更新时返回dom节点, 并将dom节点放在vm的$el上
    return createElm(vnode);
  }
  
  // 更新 or 渲染
  const isRealDom = oldVnode.nodeType;
  // 渲染
  if(isRealDom) {
    // 挂载dom
    const mountDom = oldVnode;
    // 获取父元素
    const parentEl = mountDom.parentNode;
    // 生成真实dom
    const el = createElm(vnode);
    // 将生成的dom替换掉原dom
    parentEl.insertBefore(el, mountDom.nextSibling);
    parentEl.removeChild(mountDom);
    
    return el;
  }
  
}

function createComponent(vnode) {
  let i = vnode.data;
  // createComponent方法已经给组件vnode的data设置了一个属性hook，且hook对象设置了init与inserted这两个方法
  // 如果能访问到vnode.data.hook.init则说明是一个子组件
  if((i=i.hook) && (i = i.init)) {
    i(vnode);
  }
  if(vnode.componentInstance) {
    return true;
  }
}

function createElm(vnode) {
  const {tag, children, key, data, text} = vnode;
  
  // 如果是元素标签
  if(typeof tag === 'string') {
    // 对子组件单独实例化组件
    if(createComponent(vnode)) {
      // 需要返回子组件实例
      // createComponent中调用了创建虚拟dom时设置的init方法
      // init方法是创建虚拟vnode的方法createComponent设置的, 会调用子组件的构造函数, 并调用$mount不传参数
      // 构造函数会生成实例, 生成watcher时调用_update, _update调用patch时单独对子组件进行处理, 将生成的dom元素放在实例的$el上
      // 这里返回$el即dom元素即可
      return vnode.componentInstance.$el;
    }
    
    vnode.el = document.createElement(tag);
    // 处理dom属性, 设置真实dom的属性
    updateProperties(vnode);
    
    // 递归创建子dom
    children?.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    // 文本标签
    vnode.el = document.createTextNode(text);
  }
  
  return vnode.el;
}

function updateProperties(vnode) {
  const props = vnode.data || {};
  const el = vnode.el;
  
  for(let key in props) {
    // 样式处理
    if(key === 'style') {
      for(let styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
      continue;
    }
    // 类名处理
    if(key === 'class') {
      el.className = props.class;
      continue;
    }
    // 其余
    el.setAttribute(key, props[key])
  }
}