import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import refactor from '../../src/bin/refactor'

export default makeTestSuite('test/result/refactor', {
  context: TempContext,
  /**
   * @param {TempContext} t
   */
  async getResults({ write, read }) {
    const input = await write('file.js', this.input)
    await refactor({
      input,
    })
    return await read('file.js')
  },
})