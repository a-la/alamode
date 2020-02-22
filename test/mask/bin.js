import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import { join, basename } from 'path'
import { lstatSync } from 'fs'
import { equal } from 'assert'
import Context from '../context'

const { BIN } = Context

export default makeTestSuite('test/result/bin', {
  /**
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
    normaliseOutputs: true,
  },
  splitRe: /^\/\/\/ /mg,
  context: TempContext,
})

export const plain = makeTestSuite('test/result/plain', {
  /**
   * @param {TempContext} tempContext
   */
  async getResults({ snapshot }) {
    const s = await snapshot('output')
    return s
  },
  fork: {
    module: BIN,
    /**
     * @param
     * @param {TempContext} t
     */
    async getArgs(args, { write }) {
      await write('src/input.js', this.file)
      if (this.alamoderc) await write('.alamoderc.json', this.alamoderc)
      return [...args, '-o', 'output']
    },
    getOptions({ TEMP }) {
      return {
        cwd: TEMP,
      }
    },
  },
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