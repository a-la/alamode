import { makeTestSuite } from 'zoroaster'
import { ALaMode } from '../../src/lib/transform'
import { runInNewContext } from 'vm'
import { collect } from 'catchment'

const ts = makeTestSuite('test/result/ÀLaMode.md', {
  getTransform() {
    const alamode = new ALaMode()
    return alamode
  },
})

const evaluate = makeTestSuite('test/result/evaluate', {
  /**
   * @param {string} input
   * @param {TempContext}
   */
  async getResults(input) {
    const alamode = new ALaMode()
    alamode.end(input)
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