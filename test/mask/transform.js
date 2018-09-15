import { makeTestSuite } from 'zoroaster'
import Catchment from 'catchment'
import { transformStream } from '../../src/lib/transform'

const ts = makeTestSuite('test/result/transform.md', {
  /**
   * @param {string} input
   */
  async getResults(source) {
    const writable = new Catchment()
    await transformStream({
      source,
      writable,
    })
    const res = await writable.promise
    return res
  },
})

export default ts