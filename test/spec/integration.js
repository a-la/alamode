import { equal, ok } from 'zoroaster/assert'
import { resolve } from 'path'
import SnapshotContext from 'snapshot-context'
import { readDir } from 'wrote'
import { accessSync, constants } from 'fs'
import Context from '../context'

const { X_OK } = constants

/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'transpiles source code'({ SOURCE, OUTPUT, SNAPSHOT_DIR, fork }, { setDir, test }) {
    const args = [SOURCE, '-o', OUTPUT]
    const { stdout, stderr } = await fork(args)
    equal(stdout, `Transpiled code saved to ${OUTPUT}\n`)
    ok(/ index.js/.test(stderr))
    ok(/ lib\/index.js/.test(stderr))
    ok(/ lib\/method.js/.test(stderr))
    const res = await readDir(OUTPUT, true)
    setDir(SNAPSHOT_DIR)
    await test('integration.json', res)
  },
  async 'sets the correct permissions'({ SOURCE, TEMP, fork }) {
    const file = 'index.js'
    const src = resolve(SOURCE, file)
    const output = resolve(TEMP, file)
    const args = [src, '-o', output]
    await fork(args)
    accessSync(output, X_OK)
  },
  async 'transpiles advanced'({ ADVANCED_FIXTURE, SNAPSHOT_DIR, fork }, { setDir, test }) {
    const args = [ADVANCED_FIXTURE, '-a']
    const { stdout } = await fork(args)
    setDir(SNAPSHOT_DIR)
    await test('transform-stream/advanced.js', stdout)
  },
  async 'transpiles via rc file'(
    { ADVANCED_FIXTURE, SNAPSHOT_DIR, fork, writeRc }, { setDir, test },
  ) {
    const args = [ADVANCED_FIXTURE]
    await writeRc({
      advanced: true,
    })
    const { stdout } = await fork(args)
    setDir(SNAPSHOT_DIR)
    await test('transform-stream/advanced.js', stdout)
  },
  async 'uses require hook'({ TEST_BUILD, forkRequire }) {
    if (!TEST_BUILD) {
      console.log('not testing non-built')
      return
    }
    const { stdout } = await forkRequire()
    ok(/123/.test(stdout))
    ok(/456/.test(stdout))
    ok(/hello-world/.test(stdout))
  },
  async 'uses advanced require hook via rc file'(
    { TEST_BUILD, forkRequireAdvanced, writeRc },
  ) {
    if (!TEST_BUILD) {
      console.log('not testing non-built')
      return
    }
    await writeRc({
      advanced: true,
    })
    const { stdout } = await forkRequireAdvanced()
    ok(/123/.test(stdout))
    ok(/456/.test(stdout))
    ok(/hello-world/.test(stdout))
  },
  async 'uses advanced require hook via config'(
    { TEST_BUILD, forkRequireAdvancedConfig },
  ) {
    if (!TEST_BUILD) {
      console.log('not testing non-built')
      return
    }
    const { stdout } = await forkRequireAdvancedConfig()
    ok(/123/.test(stdout))
    ok(/456/.test(stdout))
    ok(/hello-world/.test(stdout))
  },
  async 'transpiles normal'({ JS_FIXTURE, SNAPSHOT_DIR, fork }, { setDir, test }) {
    const args = [JS_FIXTURE]
    const { stdout } = await fork(args)
    setDir(SNAPSHOT_DIR)
    await test('transform-stream/fixture.js', stdout)
  },
}

export default T
