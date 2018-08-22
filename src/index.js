import { addHook } from 'pirates'
import { syncTransform } from './lib/transform'

addHook(
  (code, filename) => {
    const res = syncTransform(code, filename)
    return res
  },
  { exts: ['.js'] }
)