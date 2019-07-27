import { JSHook } from '../../src'

/** @type {Object.<string, (c: Context)>} */
const ts = {
  'does not add source maps when sourceMappingURL is present'() {
    const res = JSHook(`import test from 'test'

// #sourceMappingURL=typal.js.map`, 'test.js')
    return res
  },
}
export default ts