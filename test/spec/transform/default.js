import Catchment from 'catchment'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { transformStream } from '../../../src/lib/transform'

/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'transforms source code'(
    { JS_FIXTURE: source, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const writable = new Catchment()
    await transformStream({
      source,
      writable,
    })
    const res = await writable.promise
    await test('transform-stream/fixture.js', res)
  },
}

export default T