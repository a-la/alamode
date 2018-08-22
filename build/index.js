const { addHook } = require('pirates')
const { syncTransform } = require('./lib/transform')

/** Enable transpilation of files on-the file as a require hook. */
const alamode = () => {
  addHook(
    (code, filename) => {
      const res = syncTransform(code, filename)
      return res
    },
    { exts: ['.js'] }
  )
}

module.exports=alamode
//# sourceMappingURL=index.js.map