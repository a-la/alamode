import addHook from '@artdeco/pirates'
import transpileJsx from '@a-la/jsx'
import { syncTransform } from './lib/transform'
import { getConfig } from './lib'

/**
 * Enable transpilation of files on-the file as a require hook.
 * @param {!_alamode.HookConfig} conf The options for ÀLaMode Hook.
 * @param {string} [conf.pragma] What pragma to add on top of JSX programs. Default `const { h } = require('preact');`.
 * @param {boolean} [conf.noWarning=false] Disable warnings when resetting existing hooks. Default `false`.
 * @param {function(string): boolean} [conf.matcher="null"] The function that will be called with the path and return whether the file should be transpiled. Default `null`.
 * @param {boolean} [conf.ignoreNodeModules=true] Auto-ignore node_modules. Independent of any matcher. Default `true`.
 */
const alamode = (conf = {}) => {
  const c = getConfig()

  const {
    pragma = 'const { h } = require("preact");',
    noWarning = false,
    matcher,
    ignoreNodeModules,
  } = { ...conf, ...c }

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
    JSHook,
    { exts: ['.js'], matcher, ignoreNodeModules }
  )
  global.ALAMODE_JSX = addHook(
    (code, filename) => JSXHook(code, filename, pragma),
    { exts: ['.jsx'], matcher, ignoreNodeModules }
  )
}

export const JSHook = (code, filename) => {
  const hasSourceMap = /\/\/ *# *sourceMappingURL=.+\s*$/.test(code)
  const res = syncTransform(code, filename, hasSourceMap)
  return res
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
 * @typedef {import('../types').HookConfig} _alamode.HookConfig
 */