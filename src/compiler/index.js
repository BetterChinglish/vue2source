import {
  ncname,
  qnameCapture,
  startTagOpen,
  endTag,
  attribute,
  startTagClose,
  defaultTagRE,
} from './RegExp'

export function compileToFunction(template) {
  
  let root = parseHTML(template);
  
  console.log('compileToFunction', template);
  return function render() {
  
  }
}

function parseHTML(html) {
  while(html) {
    let textEnd = html.indexOf('<');
    if(textEnd === 0) {
      const startTagMatch = parseStartTag();
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
      }
      const endTagMatch = html.match(endTag);
      if(endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
      }
    }
  }
}