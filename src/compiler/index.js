import {parseHTML} from "./parser-html";
import { generate } from "./generate";

// 0
export function compileToFunction(template) {
  // 1 parseHTML
  // 从html文本转为js对象描述html
  let root = parseHTML(template);
  
  // 2 generate
  // 将ast语法树转为抽象方法树
  // 如遇到div，则调用c方法创建div元素
  // 遇到 {{}} 模板语法则调用s方法将其内容执行获得最终字符串
  // 等等
  let code = generate(root);
  // 使用with重定代码namespace
  const renderFn = new Function(`with(this){ return ${code}}`); // 便于console.log打印查看, 不直接return
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
