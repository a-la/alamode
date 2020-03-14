/**
 * @fileoverview
 * @externs
 */

/**
 * @const
 * @record
 */
var global
/** @type {function()|undefined} */
global.ALAMODE_JS
/** @type {function()|undefined} */
global.ALAMODE_JSX

/** @type {string} */
process.env.ALAMODE_ENV

/* typal types/Hook.xml externs */
/** @const */
var _alamode = {}
/**
 * The options for ÀLaMode Hook.
 * @typedef {{ pragma: (string|undefined), noWarning: (boolean|undefined), ignoreNodeModules: (boolean|undefined), matcher: ((function(string): boolean)|undefined) }}
 */
_alamode.HookConfig

/* typal types/ÀLaMode.xml externs */
/**
 * @record
 */
_alamode.Import
/**
 * How to replace the imported module name.
 * @type {({ from: string, to: string })|undefined}
 */
_alamode.Import.prototype.replacement
/**
 * Whether to always perform es check and add `if (__esModule)` clause. Default `false`.
 * @type {boolean|undefined}
 */
_alamode.Import.prototype.esCheck
/**
 * Rearranges imports to require them from the compiled standard library from the given path. The default imports will become named.
 * @type {({ packages: !Array<string>, path: string })|undefined}
 */
_alamode.Import.prototype.stdlib
/**
 * The list of modules that should not be checked for the `__esModule` export, i.e., knowing that they have been compiled with ÀLaMode, or are traditional CommonJS modules.
 * @type {(!Array<string>)|undefined}
 */
_alamode.Import.prototype.alamodeModules
/**
 * If the module is not in the `alamodeModules`, its _package.json_ will be inspected to see if it exports the `alamode` property that would mean it does not have to have `esCheck`. Default `false`.
 * @type {boolean|undefined}
 */
_alamode.Import.prototype.skipLookup
/**
 * The configuration set via the .alamoderc file.
 * @extends {_alamode.HookConfig}
 * @record
 */
_alamode.Config
/**
 * When set to always, will add the `_esCheck` even for internal files. By default this is switched off.
 * @type {_alamode.Import|undefined}
 */
_alamode.Config.prototype.import
/**
 * ÀLaMode instances extend the _Replaceable_ to process input data according to the rules.
 * @extends {_restream.ReplaceableInterface}
 * @interface
 */
_alamode.ÀLaMode
/**
 * Initialised markers.
 * @type {{literals: _restream.Marker, strings: _restream.Marker, comments: _restream.Marker, inlineComments: _restream.Marker, escapes: _restream.Marker, regexes: _restream.Marker, regexGroups: _restream.Marker}}
 */
_alamode.ÀLaMode.prototype.markers
/**
 * The configuration object.
 * @type {!_alamode.Config}
 */
_alamode.ÀLaMode.prototype.config
/**
 * The current file being processed.
 * @type {string}
 */
_alamode.ÀLaMode.prototype.file
/**
 * Whether the source maps are disabled, and whitespace does not need to be added for `module.exports`. Default `false`.
 * @type {boolean|undefined}
 */
_alamode.ÀLaMode.prototype.noSourceMaps
/**
 * Debug mode. Default `false`.
 * @type {boolean|undefined}
 */
_alamode.ÀLaMode.prototype.stopProcessing
/**
 * Whether the stream is running in async mode, that is, not the require hook.
 * @type {boolean}
 */
_alamode.ÀLaMode.prototype.async
/**
 * Only remap imports' locations, without transpiling into require. Default `false`.
 * @type {boolean|undefined}
 */
_alamode.ÀLaMode.prototype.renameOnly
/**
 * A sync replacement function with ÀLaMode as its `this` context.
 * @typedef {function(this: _alamode.ÀLaMode, ...string): string}
 */
_alamode.ÀLaModeReplacer
