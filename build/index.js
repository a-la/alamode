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
    (code, filename) => {
      const r = syncTransform(code, filename, true)
      const res = transpileJsx(r, { quoteProps: 1 })
      const hc = `${pragma}${res}`
      return hc
    },
    { exts: ['.jsx'] }
  )
}

module.exports=alamode