

// 对vnode递归创建真实dom，并替换掉老的oldVnode
export function patch(oldVnode, vnode) {
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

function createElm(vnode) {
  const {tag, children, key, data, text} = vnode;
  
  // 如果是元素标签
  if(typeof tag === 'string') {
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