import { makeTestSuite } from 'zoroaster'
import { ALaMode as ÀLaMode } from '../../src/lib/transform'
import { runInNewContext } from 'vm'
import { collect } from 'catchment'
import { resolve } from 'path'
import TempContext from 'temp-context'

const ts = makeTestSuite('test/result/ÀLaMode.js', {
  getTransform() {
    const alamode = new ÀLaMode()
    return alamode
  },
})

const evaluate = makeTestSuite('test/result/evaluate', {
  /**
   * @param {string} input
   * @param {TempContext}
   */
  async getResults(input) {
    const alamode = new ÀLaMode()
    alamode.end(input)
    const res = await collect(alamode)
    const sandbox = { require, test: {} }
    runInNewContext(res, sandbox)
    const { test } = sandbox
    return test
  },
  jsonProps: ['expected'],
})

export const jsx = makeTestSuite('test/result/jsx.js', {
  fork: {
    module: 'test/fixture/require',
    /**
     * @param {TempContext} t
     */
    async getOptions({ write }) {
      const p = await write('temp.jsx', this.input)
      return {
        env: {
          MODULE_PATH: resolve(p),
        },
      }
    },
  },
  context: TempContext,
  jsonProps: ['expected'],
})

export { evaluate }
export default ts