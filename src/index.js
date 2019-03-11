import { addHook } from 'pirates'
import transpileJsx from '@a-la/jsx'
import { syncTransform } from './lib/transform'

/** Enable transpilation of files on-the file as a require hook. */
const alamode = ({
  pragma = 'const { h } = require("preact");',
} = {}) => {
  if (global.ALAMODE_JS) {
    console.warn('Reverting JS hook to add new one.')
    global.ALAMODE_JS()
  }
  if (global.ALAMODE_JSX) {
    console.warn('Reverting JSX hook to add new one, pragma:')
    console.warn(pragma)
    global.ALAMODE_JSX()
  }
  global.ALAMODE_JS = addHook(
    (code, filename) => {
      const res = syncTransform(code, filename)
      return res
    },
    { exts: ['.js'] }
  )
  global.ALAMODE_JSX = addHook(
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