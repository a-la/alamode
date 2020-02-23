import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import { dirname, sep } from 'path'
import refactor from '../../src/bin/refactor'
import { EOL } from 'os'

export default makeTestSuite('test/result/refactor/default', {
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

export const dir = makeTestSuite('test/result/refactor/dir', {
  context: TempContext,
  /**
   * @param {TempContext} t
   */
  async getResults({ write, snapshot }) {
    const input = await write('dir/file.js', this.input)
    await refactor({
      input: dirname(input),
    })
    return (await snapshot())
      .replace(sep, '/')
      .replace(/\r\n/g, '\n')
      .replace(/\n/g, EOL)
  },
})