let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

       const argsConfig = {
  'source': {
    description: 'The location of the input file or directory to transpile.',
    command: true,
  },
  'output': {
    description: 'The location of where to save the transpiled output.',
    short: 'o',
  },
  'version': {
    description: 'Show the version number.',
    boolean: true,
    short: 'v',
  },
  'help': {
    description: 'Display the usage information.',
    boolean: true,
    short: 'h',
  },
  'ignore': {
    description: 'Comma-separated list of files inside of `source` dir to\nignore, for example, `bin,.eslintrc`.',
    short: 'i',
  },
  'noSourceMaps': {
    description: 'Disable source maps.',
    boolean: true,
    short: 's',
  },
  'extensions': {
    description: 'Files of what extensions to transpile.',
    default: 'js,jsx',
    short: 'e',
  },
  'jsx': {
    description: 'Enable JSX mode: only update JSX syntax to use hyperscript.\nDoes not transpile `import/export` statements.',
    boolean: true,
    short: 'j',
  },
  'preact': {
    description: 'When transpiling JSX, automatically insert at the top\n`import { h } from "preact"`.',
    boolean: true,
    short: 'p',
  },
}
const args = argufy(argsConfig)

/**
 * The location of the input file or directory to transpile.
 */
       const _source = /** @type {string} */ (args['source'])

/**
 * The location of where to save the transpiled output.
 */
       const _output = /** @type {string} */ (args['output'])

/**
 * Show the version number.
 */
       const _version = /** @type {boolean} */ (args['version'])

/**
 * Display the usage information.
 */
       const _help = /** @type {boolean} */ (args['help'])

/**
 * Comma-separated list of files inside of `source` dir to
    ignore, for example, `bin,.eslintrc`.
 */
       const _ignore = /** @type {string} */ (args['ignore'])

/**
 * Disable source maps.
 */
       const _noSourceMaps = /** @type {boolean} */ (args['noSourceMaps'])

/**
 * Files of what extensions to transpile. Default `js,jsx`.
 */
       const _extensions = /** @type {string} */ (args['extensions']) || 'js,jsx'

/**
 * Enable JSX mode: only update JSX syntax to use hyperscript.
    Does not transpile `import/export` statements.
 */
       const _jsx = /** @type {boolean} */ (args['jsx'])

/**
 * When transpiling JSX, automatically insert at the top
    `import { h } from "preact"`.
 */
       const _preact = /** @type {boolean} */ (args['preact'])

/**
 * The additional arguments passed to the program.
 */
       const _argv = /** @type {!Array<string>} */ (args._argv)

module.exports.argsConfig = argsConfig
module.exports._source = _source
module.exports._output = _output
module.exports._version = _version
module.exports._help = _help
module.exports._ignore = _ignore
module.exports._noSourceMaps = _noSourceMaps
module.exports._extensions = _extensions
module.exports._jsx = _jsx
module.exports._preact = _preact
module.exports._argv = _argv