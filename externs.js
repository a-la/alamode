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
 * @typedef {{ pragma: (string|undefined), noWarning: (boolean|undefined), matcher: ((function(string): boolean)|undefined), ignoreNodeModules: (boolean|undefined) }}
 */
_alamode.HookConfig

/* typal types/ÀLaMode.xml externs */
/**
 * The configuration set via the .alamoderc file.
 * @record
 */
_alamode.Config
/**
 * When set to always, will add the `_esCheck` even for internal files. By default this is switched off.
 * @type {({ replacement: ({ from: string, to: string }|undefined), esCheck: (string|undefined) })|undefined}
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
 * A sync replacement function with ÀLaMode as its `this` context.
 * @typedef {function(this: _alamode.ÀLaMode, ...string): string}
 */
_alamode.ÀLaModeReplacer
