import { makeTestSuite } from 'zoroaster'
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
  async getResults(input, { snapshot }) {
    const s = await snapshot()
    return s
  },
  fork: {
    module: BIN,
    getArgs(args, { TEMP }) {
      return [...args, '-o', TEMP]
    },
    options: {
      execArgv: [],
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
    options: {
      execArgv: [],
    },
  },
  getResults(input, { TEMP }) {
    const b = basename(input)
    const j = join(TEMP, b)
    equal(lstatSync(j).mode, lstatSync(input).mode)
    return 'ok'
  },
  context: TempContext,
})

export { rights }
export default ts