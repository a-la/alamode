import argufy from 'argufy'

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
export const _input = args['input']

/**
 * @type {string} The path to the output file or directory.
 */
export const _output = args['output']
/**
 * @type {boolean} Show version.
 */
export const _version = args['version']
/**
 * @type {boolean} Show help.
 */
export const _help = args['help']
/**
 * @type {string} Ignore files
 */
export const _ignore = args['ignore']
/**
 * @type {boolean} Don't produce source maps.
 */
export const _noSourceMaps = args['noSourceMaps']
/**
 * @type {string} Process these extensions. Default `js,jsx`.
 */
export const _extensions = args['extensions'] || 'js,jsx'
/**
 * @type {boolean} Process as jsx modules.
 */
export const _jsx = args['jsx']
/**
 * @type {boolean} Add Preact pragma when processing.
 */
export const _preact = args['preact']