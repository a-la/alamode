let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

const args = argufy({
  'input': { command: true },
  'output': { short: 'o' },
  'version': { short: 'v', boolean: true },
  'help': { short: 'h', boolean: true },
  'ignore': { short: 'i' },
  'noSourceMaps': { short: 's', boolean: true },
  'extensions': { short: 'e' },
  'jsx': { short: 'j', boolean: true },
  'preact': { short: 'p', boolean: true },
})

/**
 * @type {string} The path to the input file or directory.
 */
       const _input = args['input']

/**
 * @type {string} The path to the output file or directory.
 */
       const _output = args['output']
/**
 * @type {boolean} Show version.
 */
       const _version = args['version']
/**
 * @type {boolean} Show help.
 */
       const _help = args['help']
/**
 * @type {string} Ignore files
 */
       const _ignore = args['ignore']
/**
 * @type {boolean} Don't produce source maps.
 */
       const _noSourceMaps = args['noSourceMaps']
/**
 * @type {string} Process these extensions. Default `js,jsx`.
 */
       const _extensions = args['extensions'] || 'js,jsx'
/**
 * @type {boolean} Process as jsx modules.
 */
       const _jsx = args['jsx']
/**
 * @type {boolean} Add Preact pragma when processing.
 */
       const _preact = args['preact']

module.exports._input = _input
module.exports._output = _output
module.exports._version = _version
module.exports._help = _help
module.exports._ignore = _ignore
module.exports._noSourceMaps = _noSourceMaps
module.exports._extensions = _extensions
module.exports._jsx = _jsx
module.exports._preact = _preact