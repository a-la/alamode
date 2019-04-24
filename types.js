export {}

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
 * @typedef {_alamode.ÀLaMode} ÀLaMode ÀLaMode instances extend the _Replaceable_ to process input data according to the rules.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_restream.ReplaceableInterface & _alamode.$ÀLaMode} _alamode.ÀLaMode ÀLaMode instances extend the _Replaceable_ to process input data according to the rules.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _alamode.$ÀLaMode ÀLaMode instances extend the _Replaceable_ to process input data according to the rules.
 * @prop {{literals: _restream.Marker, strings: _restream.Marker, comments: _restream.Marker, inlineComments: _restream.Marker, escapes: _restream.Marker, regexes: _restream.Marker, regexGroups: _restream.Marker}} markers Initialised markers.
 * @prop {!_alamode.Config} config The configuration object.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_alamode.ÀLaModeReplacer} ÀLaModeReplacer A sync replacement function with ÀLaMode as its `this` context.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {function(this: _alamode.ÀLaMode, ...string): string} _alamode.ÀLaModeReplacer A sync replacement function with ÀLaMode as its `this` context.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('restream').ReplaceableInterface} _restream.ReplaceableInterface
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('restream/src/lib/markers').Marker} _restream.Marker
 */
