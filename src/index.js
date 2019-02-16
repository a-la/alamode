import { addHook } from 'pirates'
import transpileJsx from '@a-la/jsx'
import { syncTransform } from './lib/transform'

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

export const JSXHook = (code, filename, pragma) => {
  const r = syncTransform(code, filename, true)
  const res = transpileJsx(r)
  const hc = `${pragma}${res}`
  return hc
}

export default alamode