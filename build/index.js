const { addHook } = require('pirates')
const { syncTransform } = require('./lib/transform')

addHook(
  (code, filename) => {
    const res = syncTransform(code, filename)
    return res
  },
  { exts: ['.js'] }
)
//# sourceMappingURL=index.js.map