const $alamode = require('./depack')

/**
 * Enable transpilation of files on-the file as a require hook.
 * @param {!_alamode.HookConfig} conf The options for ÀLaMode Hook.
 * @param {string} [conf.pragma] What pragma to add on top of JSX programs. Default `const { h } = require('preact');`.
 * @param {boolean} [conf.noWarning=false] Disable warnings when resetting existing hooks. Default `false`.
 * @param {function(string): boolean} [conf.matcher="null"] The function that will be called with the path and return whether the file should be transpiled. Default `null`.
 * @param {boolean} [conf.ignoreNodeModules=true] Auto-ignore node_modules. Independent of any matcher. Default `true`.
 */
module.exports = function alamode(conf) {
  return $alamode(conf)
}

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
 * @prop {function(string): boolean} [matcher="null"] The function that will be called with the path and return whether the file should be transpiled. Default `null`.
 * @prop {boolean} [ignoreNodeModules=true] Auto-ignore node_modules. Independent of any matcher. Default `true`.
 */
