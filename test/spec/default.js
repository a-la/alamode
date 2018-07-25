import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import alamode from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof alamode, 'function')
  },
  async 'calls package without error'() {
    await alamode()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await alamode({
      type: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T
