import addHook from '@artdeco/pirates'
import transpileJsx from '@a-la/jsx'
import { syncTransform } from './lib/transform'

/**
 * Enable transpilation of files on-the file as a require hook.
 * @param {!_alamode.HookConfig} conf The options for ÀLaMode Hook.
 * @param {string} [conf.pragma] What pragma to add on top of JSX programs. Default `const { h } = require('preact');`.
 * @param {boolean} [conf.noWarning=false] Disable warnings when resetting existing hooks. Default `false`.
 */
const alamode = (conf = {}) => {
  const {
    pragma = 'const { h } = require("preact");',
    noWarning = false,
  } = conf
  if (global.ALAMODE_JS) {
    if (!noWarning)
      console.warn('Reverting JS hook to add new one.')
    global.ALAMODE_JS()
  }
  if (global['ALAMODE_JSX']) {
    if (!noWarning) {
      console.warn('Reverting JSX hook to add new one, pragma:')
      console.warn(pragma)
    }
    global['ALAMODE_JSX']()
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

/* typal types/Hook.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_alamode.HookConfig} HookConfig The options for ÀLaMode Hook.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _alamode.HookConfig The options for ÀLaMode Hook.
 * @prop {string} [pragma] What pragma to add on top of JSX programs. Default `const { h } = require('preact');`.
 * @prop {boolean} [noWarning=false] Disable warnings when resetting existing hooks. Default `false`.
 */
