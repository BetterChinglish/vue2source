
export function createElement(tag, data, children) {
  console.log('createElement', tag, attrs, children)
  let key = data.key;
  if(key) {
    delete data.key;
  }
  
  return vnode(tag, data, key, children, undefined);
}

export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text);
}

// 标签名、属性数据、key、孩子节点、文本内容
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}