import makeTestSuite from '@zoroaster/mask'
import Catchment from 'catchment'
import { EOL } from 'os'
import { transformStream } from '../../src/lib/transform'

const ts = makeTestSuite('test/result/transform', {
  /**
   * @param {string} input
   */
  async getResults() {
    const writable = new Catchment()
    await transformStream({
      source: this.input,
      writable,
    })
    const res = await writable.promise
    return res
  },
  mapActual(res) {
    return res
      .replace(/\r?\n/g, EOL)
  },
})

export default ts