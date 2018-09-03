import { addHook } from 'pirates'
import { syncTransform } from './lib/transform'

/** Enable transpilation of files on-the file as a require hook. */
const alamode = ({
  advanced = false,
} = {}) => {
  addHook(
    (code, filename) => {
      const res = syncTransform(code, filename, advanced)
      return res
    },
    { exts: ['.js'] }
  )
}

export default alamode