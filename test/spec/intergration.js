import { equal, ok } from 'zoroaster/assert'
import { resolve } from 'path'
import Catchment from 'catchment'
import { fork } from 'spawncommand'
import SnapshotContext from 'snapshot-context'
import { readDir } from 'wrote'
import { accessSync, constants } from 'fs'
import Context from '../context'

const { X_OK } = constants

const ALAMODE = process.env.BABEL_ENV == 'test-build' ? '../../build/bin' : '../../src/bin/alamode'
const BIN = resolve(__dirname, ALAMODE)

/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'transpiles source code'({ SOURCE, OUTPUT, SNAPSHOT_DIR }, { setDir, test }) {
    const args = [SOURCE, '-o', OUTPUT]
    const { promise, stdout, stderr } = fork(BIN, args, {
      stdio: 'pipe',
      env: {
        NODE_DEBUG: 'alamode',
      },
      execArgv: [],
    })
    const { promise: stdoutPromise } = new Catchment({
      rs: stdout,
    })
    const { promise: stderrPromise } = new Catchment({
      rs: stderr,
    })
    await promise
    const [, so, se] = await Promise.all([
      promise,
      stdoutPromise,
      stderrPromise,
    ])
    equal(so, `Transpiled code saved to ${OUTPUT}\n`)
    ok(/ index.js/.test(se))
    ok(/ lib\/index.js/.test(se))
    ok(/ lib\/method.js/.test(se))
    const res = await readDir(OUTPUT, true)
    setDir(SNAPSHOT_DIR)
    await test('integration.json', res)
  },
  async 'sets the correct permissions'({ SOURCE, TEMP }) {
    const file = 'index.js'
    const src = resolve(SOURCE, file)
    const output = resolve(TEMP, file)
    const args = [src, '-o', output]
    const { promise } = fork(BIN, args, {
      stdio: 'pipe',
      env: {
        NODE_DEBUG: 'alamode',
      },
      execArgv: [],
    })
    await promise
    accessSync(output, X_OK)
  },
}

export default T
