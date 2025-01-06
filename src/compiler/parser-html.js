import {attribute, endTag, startTagClose, startTagOpen} from "./RegExp";


export function parseHTML(html) {
  
  let root = null;
  let currentParent = null;
  let stack = [];
  
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;
  
  while(html) {
    let textEnd = html.indexOf('<');
    // 标签，起始一定为 '<'
    if(textEnd === 0) {
      // 起始标签：获取匹配结果tagName，attrs
      const startTagMatch = parseStartTag();
      // 如果匹配到了则进入下次匹配否则继续判断是否其他情况的内容
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      
      // 结束标签
      let endTagMatch = html.match(endTag);
      if(endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
    
    // 文本
    let text;
    // 不在首位，则说明以非 < 开头，则作为文本处理
    if(textEnd >= 0) {
      text = html.substring(0, textEnd);
      advance(text.length);
      chars(text)
    }
  }
  
  return root;
  
  function advance(n) {
    html = html.substring(n);
  }
  
  // 获取标签名和属性
  function parseStartTag() {
    let start = html.match(startTagOpen);
    if(start) {
      // 匹配到开始标签，移动对应开始标签的长度
      advance(start[0].length);
      // 存储匹配到的结果
      const match = {
        tagName: start[1],
        attrs: []
      }
      // 匹配属性：没有匹配到结束标签且匹配到属性
      let end, attr;
      while( !(end = html.match(startTagClose)) && (attr = html.match(attribute)) ) {
        // 存储匹配结果，属性名和属性值，注意属性值的捕获组
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        });
        advance(attr[0].length);
      }
      
      // 去除开始标签的：‘>’ 符号
      if(end) {
        advance(end[0].length);
        return match;
      }
    }
  }
  
  
  function start(tagName, attrs) {
    // console.log('起始标签: ', tagName, '属性为: ', attrs);
    let element = createASTElement(tagName, attrs);
    if(!root) {
      root = element;
    }
    currentParent = element;
    stack.push(element);
    
  }
  
  function chars(text) {
    // console.log('文本内容: ', text);
    text = text.replace(/\s/g, '');
    if(text) {
      // 文本类型节点应该是叶子节点
      currentParent.children.push({
        text,
        type: TEXT_TYPE
      })
    }
  }
  
  function end(tagName) {
    // 所有element都放入stack，每次遇到闭合标签时设定父子关系
    // 当前关闭的元素
    let element = stack.pop();
    // 那么element的父元素则是此时stack最后一个元素
    currentParent = stack[stack.length - 1];
    // 如果有父元素则设置关系，并将当前关闭的element放入父元素的children中
    if(currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }
  
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: currentParent
    }
  }
  
}
