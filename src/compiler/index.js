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
  return `_v(${text})`
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
    root.attrs.length ? genProps(root.attrs) : "undefined"
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
  
  return function render() {
  
  }
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
