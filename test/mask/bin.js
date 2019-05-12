import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import { join, basename } from 'path'
import { lstatSync } from 'fs'
import { equal } from 'assert'
import Context from '../context'

const { BIN } = Context

const ts = makeTestSuite('test/result/bin.md', {
  /**
   * @param {string} input
   * @param {TempContext} tempContext
   */
  async getResults({ snapshot }) {
    const s = await snapshot()
    return s
  },
  fork: {
    module: BIN,
    getArgs(args, { TEMP }) {
      return [...args, '-o', TEMP]
    },
  },
  splitRe: /^\/\/\/ /mg,
  context: TempContext,
})

const rights = makeTestSuite('test/result/rights.md', {
  fork: {
    module: BIN,
    /**
     * @param {string[]}
     * @param {TempContext}
     */
    getArgs(src, { TEMP }) {
      return [...src, '-o', TEMP]
    },
  },
  getResults({ TEMP }) {
    const b = basename(this.input)
    const j = join(TEMP, b)
    equal(lstatSync(j).mode, lstatSync(this.input).mode)
    return 'ok'
  },
  context: TempContext,
})

export { rights }
export default ts