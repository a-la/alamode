import makeTestSuite from '@zoroaster/mask'
import { resolve } from 'path'
import TempContext from 'temp-context'

export default makeTestSuite('test/result/jsx.js', {
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
