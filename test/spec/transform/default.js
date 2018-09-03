import Catchment from 'catchment'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { transformStream, transformString, syncTransform } from '../../../src/lib/transform'

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
  async 'transforms source code (sync)'(
    { JS_FIXTURE: source, SNAPSHOT_DIR, readFile }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const src = await readFile(source)
    const res = transformString(src)
    await test('transform-stream/fixture.js', res)
  },
  async 'transforms source code with sourcemap (sync)'(
    { JS_FIXTURE: source, SNAPSHOT_DIR, readFile }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const src = await readFile(source)
    const res = syncTransform(src, source)
    await test('transform-stream/fixture-sourcemap.js', res)
  },
  async 'transforms source code (advanced)'(
    { ADVANCED_FIXTURE: source, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const writable = new Catchment()
    await transformStream({
      source,
      writable,
      advanced: true,
    })
    const res = await writable.promise
    await test('transform-stream/advanced.js', res)
  },
  async 'transforms source code (sync, advanced)'(
    { ADVANCED_FIXTURE: source, SNAPSHOT_DIR, readFile }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const src = await readFile(source)
    const res = transformString(src, true)
    await test('transform-stream/advanced.js', res)
  },
  async 'transforms source code with sourcemap (sync, advanced)'(
    { JS_FIXTURE: source, SNAPSHOT_DIR, readFile }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const src = await readFile(source)
    const res = syncTransform(src, source, true)
    await test('transform-stream/advanced-sourcemap.js', res)
  },
}

export default T