const $alamode = require('./depack')

/**
 * Enable transpilation of files on-the file as a require hook.
 * @param {!_alamode.HookConfig} conf The options for ÀLaMode Hook.
 * @param {string} [conf.pragma] What pragma to add on top of JSX programs. Default `const { h } = require('preact');`.
 * @param {boolean} [conf.noWarning=false] Disable warnings when resetting existing hooks. Default `false`.
 * @param {boolean} [conf.ignoreNodeModules=true] Auto-ignore node_modules. Independent of any matcher. Default `true`.
 * @param {(path: string) => boolean} [conf.matcher] The function that will be called with the path and return whether the file should be transpiled.
 */
module.exports = function alamode(conf) {
  return $alamode(conf)
}

/* typal types/Hook.xml namespace */
/**
 * @typedef {_alamode.HookConfig} HookConfig The options for ÀLaMode Hook.
 * @typedef {Object} _alamode.HookConfig The options for ÀLaMode Hook.
 * @prop {string} [pragma] What pragma to add on top of JSX programs. Default `const { h } = require('preact');`.
 * @prop {boolean} [noWarning=false] Disable warnings when resetting existing hooks. Default `false`.
 * @prop {boolean} [ignoreNodeModules=true] Auto-ignore node_modules. Independent of any matcher. Default `true`.
 * @prop {(path: string) => boolean} [matcher] The function that will be called with the path and return whether the file should be transpiled.
 */
