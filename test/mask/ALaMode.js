import makeTestSuite from '@zoroaster/mask'
import { ÀLaMode } from '../../src/lib/transform'
import { runInNewContext } from 'vm'
import { collect } from 'catchment'

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
  async getResults() {
    const alamode = new ÀLaMode()
    alamode.end(this.input)
    const res = await collect(alamode)
    const sandbox = { require, test: {} }
    runInNewContext(res, sandbox)
    const { test } = sandbox
    return test
  },
  jsonProps: ['expected'],
})

export { evaluate }
export default ts