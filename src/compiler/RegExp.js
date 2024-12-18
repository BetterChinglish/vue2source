// abc-abc
export const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`

// abc-abc:abc-abc
export const qnameCapture = `((?:${ncname}\\:)?${ncname})`

// <abc-abc:abc-abc   标签开头
export const startTagOpen = new RegExp(`^<${qnameCapture}`)

// 标签结束: < /  XXX >
export const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

// 属性:  id="app"  id='app'  id=app
export const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

// 标签结束(自闭标签):  / >
export const startTagClose = /^\s*(\/?)>/

// 取值: {{  xxx  }}
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
