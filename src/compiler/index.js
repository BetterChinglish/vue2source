import {parseHTML} from "./parser-html";

import {defaultTagRE} from "./RegExp";

// 3
function genProps(attrs) {
  let str = '';
  
  // attrs是个对象数组，对象属性有标签的属性名和该属性名的属性值
  for(let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    
    // style="color:red" ---> { style: { color: 'red' } }
    if(attr.name === 'style') {
      let obj = {};
      // 属性值键值对以分号隔开
      // style="color:red; fontSize:     14px"
      attr.value.split(';').forEach(item => {
        const keyValueArr = item.split(':')
        // color : red, 第一个是key， 第二个是value
        if(keyValueArr.length <= 1) {
          return;
        }
        let [key, value] = keyValueArr;
        // 如果简化写法那就不处理空格，如果要处理空格可以在这里或者在后续使用value的地方
        obj[key.trim()] = value.trim();
      })
      
      attr.value = obj;
    }
    
    str += `${attr.name}:${JSON.stringify(attr.value)}`
    
    // 非最后一项的话，拼接 逗号
    // { style: {key: value}, class: }
    if(i !== attrs.length - 1) {
      str += ','
    }
    
  }
  str = `{${str}}`
  return str;
}

// 5
function gen(node) {
  // 元素标签, 则又回到与根节点一样的处理，直接递归
  if(node.type === 1) {
    return generate(node);
  }
  
  // 文本标签
  const text = node.text;
  // 处理文本  hello {{ name }} your age: {{ age }} something else
  let tokens = [];
  let match, index;
  let lastIndex = defaultTagRE.lastIndex = 0;
  while (match = defaultTagRE.exec(text)) {
    // 匹配到的结果的开始位置
    index = match.index;
    // 如果大于，说明不是起始就是{{}}, 而是类似 something1 {{something2}}, 需要将something1先存下来
    if(index > lastIndex) {
      // something1是文本，需要拼接“”，使用JSON.stringfy， something2是变量，不要“”
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // 再将匹配到的{{something2}}放进来，something2是变量，不要“”
    tokens.push(`_s(${match[1].trim()})`);
    // 这里不能直接使用defaultTagRE.lastIndex, 因为最后匹配不到的时候defaultTagRE.lastIndex是字符串的长度，而不是{{}}结果的末尾
    lastIndex = index + match[0].length;
  }
  
  // 例如{{last something1}} something2上面的while是匹配的{{}}，那么这里的something2不会匹配到，也要放进来
  if(lastIndex < text.length) {
    // 最后没匹配到的多余的也是字符串，需要拼接“”
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  
  return `_v(${tokens.join('+')})`;
}

// 4
// 递归创建子节点字符串
function genChildren(root) {
  const children = root?.children || [];
  
  // [_c(xx, xxx, xxx), _c(xx), xxx]
  // 没啥意义的判空, 但习惯
  if(!children.length) {
    return false;
  }
  
  return `${
    // 多个兄弟节点则遍历返回并使用逗号分割
    children.map(kid => {
      return gen(kid)
    }).join((', '))
  }`
  
}

// 2
// 根节点必是元素节点
function generate(root) {
  // 通过html的ast树生成字符串，保持类似如下格式，估计是为了方便执行，即生成可执行字符串代码
  // _c(elementName, elementAttributes, elementChildren)
  let code = `_c("${  // 标签名
    root.tag
  }", ${  // 属性对象
    root.attrs.length ? genProps(root.attrs) : "{}"
  }${ // 节点的子节点
    root.children?.length ? `, [ ${genChildren(root)} ]` : ''  // 如果有子节点就再去处理子节点, 补药忘了逗号
  })`;
  return code;
}


// 1
export function compileToFunction(template) {
  
  // 从html文本转为js对象描述html
  let root = parseHTML(template);
  
  // 将ast语法树转为抽象方法树
  // 如遇到div，则调用c方法创建div元素
  // 遇到 {{}} 模板语法则调用s方法将其内容执行获得最终字符串
  // 等等
  let code = generate(root);
  // 使用with重定代码namespace
  const renderFn = new Function(`with(this){ return ${code}}`);
  return renderFn;
}

/*parseHTML*/
// <div id="app">
//   <p>hello</p>
// </div>
//  =>
// let root = {
//   tag: 'div',
//   type: 1,
//   children: [
//     {
//       tag: 'p',
//       type: 1,
//       children: [
//         {
//           text: 'hello',
//           type: 3
//         }
//       ]
//     }
//   ]
// }
