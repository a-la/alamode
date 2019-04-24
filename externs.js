/* typal types/ÀLaMode.xml */
/** @const */
var _alamode = {}
/**
 * The configuration set via the .alamoderc file.
 * @record
 */
_alamode.Config
/**
 * When set to always, will add the `_esCheck` even for internal files. By default this is switched off.
 * @type {({ esCheck: (string|undefined) }|undefined)}
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
