import argufy from 'argufy'

export const argsConfig = {
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
  'module': {
    description: 'Works together with `jsx` to also transpile modules while\ntranspiling JSX.',
    boolean: true,
    short: 'm',
  },
  'preact': {
    description: 'When transpiling JSX, automatically insert at the top\n`import { h } from "preact"`.',
    boolean: true,
    short: 'p',
  },
  'preact-externs': {
    description: 'Same as `preact`, but imports from `＠externs/preact`\n`import { h } from "＠externs/preact"`.',
    boolean: true,
    short: 'E',
  },
  'debug': {
    description: 'Will make ÀLaMode stop after replacing markers.',
    boolean: true,
    short: 'd',
  },
  'require': {
    description: 'Renames `require` calls into imports, and `module.exports` assignments to exports.\nGreat for refactoring older code.',
    boolean: true,
    short: 'r',
  },
}
const args = argufy(argsConfig)

/**
 * The location of the input file or directory to transpile.
 */
export const _source = /** @type {string} */ (args['source'])

/**
 * The location of where to save the transpiled output.
 */
export const _output = /** @type {string} */ (args['output'])

/**
 * Show the version number.
 */
export const _version = /** @type {boolean} */ (args['version'])

/**
 * Display the usage information.
 */
export const _help = /** @type {boolean} */ (args['help'])

/**
 * Comma-separated list of files inside of `source` dir to
    ignore, for example, `bin,.eslintrc`.
 */
export const _ignore = /** @type {string} */ (args['ignore'])

/**
 * Disable source maps.
 */
export const _noSourceMaps = /** @type {boolean} */ (args['noSourceMaps'])

/**
 * Files of what extensions to transpile. Default `js,jsx`.
 */
export const _extensions = /** @type {string} */ (args['extensions'] || 'js,jsx')

/**
 * Enable JSX mode: only update JSX syntax to use hyperscript.
    Does not transpile `import/export` statements.
 */
export const _jsx = /** @type {boolean} */ (args['jsx'])

/**
 * Works together with `jsx` to also transpile modules while
    transpiling JSX.
 */
export const _module = /** @type {boolean} */ (args['module'])

/**
 * When transpiling JSX, automatically insert at the top
    `import { h } from "preact"`.
 */
export const _preact = /** @type {boolean} */ (args['preact'])

/**
 * Same as `preact`, but imports from `＠externs/preact`
    `import { h } from "＠externs/preact"`.
 */
export const _preactExterns = /** @type {boolean} */ (args['preact-externs'])

/**
 * Will make ÀLaMode stop after replacing markers.
 */
export const _debug = /** @type {boolean} */ (args['debug'])

/**
 * Renames `require` calls into imports, and `module.exports` assignments to exports.
    Great for refactoring older code.
 */
export const _require = /** @type {boolean} */ (args['require'])

/**
 * The additional arguments passed to the program.
 */
export const _argv = /** @type {!Array<string>} */ (args._argv)