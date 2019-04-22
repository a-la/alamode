import { addHook } from 'pirates'
import transpileJsx from '@a-la/jsx'
import { syncTransform } from './lib/transform'

/** Enable transpilation of files on-the file as a require hook. */
const alamode = ({
  pragma = 'const { h } = require("preact");',
  noWarning = false,
} = {}) => {
  if (global.ALAMODE_JS) {
    if (!noWarning)
      console.warn('Reverting JS hook to add new one.')
    global.ALAMODE_JS()
  }
  if (global.ALAMODE_JSX) {
    if (!noWarning) {
      console.warn('Reverting JSX hook to add new one, pragma:')
      console.warn(pragma)
    }
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

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('restream/src/lib/markers').Marker} _restream.Marker
 */

/* typal types/ÀLaMode.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_alamode.Config} Config The configuration set via the .alamoderc file.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _alamode.Config The configuration set via the .alamoderc file.
 * @prop {{ esCheck: (string|undefined) }} [import] When set to always, will add the `_esCheck` even for internal files. By default this is switched off.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_alamode.ÀLaModeReplacer} ÀLaModeReplacer A sync replacement function with ÀLaMode as its `this` context.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {function(this: _alamode.ÀLaMode, ...string): string} _alamode.ÀLaModeReplacer A sync replacement function with ÀLaMode as its `this` context.
 */
