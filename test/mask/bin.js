import Context from '../context'
import { makeTestSuite } from 'zoroaster'
import TempContext from 'temp-context'
import { equal } from 'zoroaster/assert'

const ts = makeTestSuite('test/result/bin.md', {
  /**
   *
   * @param {string} input
   * @param {Context} context
   * @param {TempContext} tempContext
   */
  async getResults(input, { fork }, { TEMP, snapshot }) {
    const args = input.split(' ')
    const res = await fork([...args, '-o', TEMP])
    const s = await snapshot()
    return { snapshot: s, ...res }
    // const args = [input, '-o', ]
    // equal(so, `Transpiled code saved to ${OUTPUT}\n`)
    // const res = await readDir(OUTPUT, true)
    // setDir(SNAPSHOT_DIR)
    // await test('integration.json', res)
  },
  assertResults({ stderr: actualE, stdout: actualO }, { stderr, stdout }) {
    equal(actualO, stdout)
  },
  mapActual({ snapshot }) {
    return snapshot
  },
  context: [Context, TempContext],
})

export default ts