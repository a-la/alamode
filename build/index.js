const { debuglog } = require('util')

const LOG = debuglog('alamode')

/**
 * A Node.js regex-based transpiler of source code.
 * @param {Config} config Configuration object.
 * @param {string} config.type The type.
 */
async function alamode(config = {}) {
  const {
    type,
  } = config
  LOG('alamode called with %s', type)
  return type
}

/**
 * @typedef {Object} Config
 * @property {string} type The type.
 */

module.exports = alamode