import {parseHTML} from "./parser-html";

export function compileToFunction(template) {
  let root = parseHTML(template);
  console.log(root);
  
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
