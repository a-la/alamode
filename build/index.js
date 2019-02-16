const { addHook } = require('pirates');
let transpileJsx = require('@a-la/jsx'); if (transpileJsx && transpileJsx.__esModule) transpileJsx = transpileJsx.default;
const { syncTransform } = require('./lib/transform');

let added
/** Enable transpilation of files on-the file as a require hook. */
const alamode = ({
  pragma = 'const { h } = require("preact");',
} = {}) => {
  if (added) return
  added = true
  addHook(
    (code, filename) => {
      const res = syncTransform(code, filename)
      return res
    },
    { exts: ['.js'] }
  )
  addHook(
    (code, filename) => JSXHook(code, filename, pragma),
    { exts: ['.jsx'] }
  )
}

       const JSXHook = (code, filename, pragma) => {
  const r = syncTransform(code, filename, true)
  const res = transpileJsx(r)
  const hc = `${pragma}${res}`
  return hc
}

module.exports=alamode

module.exports.JSXHook = JSXHook