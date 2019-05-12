export {}

/* typal types/ÀLaMode.xml closure noSuppress */
/**
 * @typedef {_alamode.Config} Config `@record` The configuration set via the .alamoderc file.
 */
/**
 * @typedef {Object} _alamode.Config `@record` The configuration set via the .alamoderc file.
 * @prop {{ replacement: ({ from: string, to: string }|undefined), esCheck: (string|undefined) }} [import] When set to always, will add the `_esCheck` even for internal files. By default this is switched off.
 */
/**
 * @typedef {_alamode.ÀLaMode} ÀLaMode `@interface` ÀLaMode instances extend the _Replaceable_ to process input data according to the rules.
 */
/**
 * @typedef {_restream.ReplaceableInterface & _alamode.$ÀLaMode} _alamode.ÀLaMode `@interface` ÀLaMode instances extend the _Replaceable_ to process input data according to the rules.
 */
/**
 * @typedef {Object} _alamode.$ÀLaMode `@interface` ÀLaMode instances extend the _Replaceable_ to process input data according to the rules.
 * @prop {{literals: _restream.Marker, strings: _restream.Marker, comments: _restream.Marker, inlineComments: _restream.Marker, escapes: _restream.Marker, regexes: _restream.Marker, regexGroups: _restream.Marker}} markers Initialised markers.
 * @prop {!_alamode.Config} config The configuration object.
 */
/**
 * @typedef {_alamode.ÀLaModeReplacer} ÀLaModeReplacer A sync replacement function with ÀLaMode as its `this` context.
 */
/**
 * @typedef {function(this: _alamode.ÀLaMode, ...string): string} _alamode.ÀLaModeReplacer A sync replacement function with ÀLaMode as its `this` context.
 */
/**
 * @typedef {import('restream').ReplaceableInterface} _restream.ReplaceableInterface
 */
/**
 * @typedef {import('restream/src/lib/markers').Marker} _restream.Marker
 */
