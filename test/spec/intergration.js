import { equal, ok } from 'zoroaster/assert'
import { resolve } from 'path'
import Catchment from 'catchment'
import { fork } from 'spawncommand'
import SnapshotContext from 'snapshot-context'
import { readDir } from 'wrote'
import { accessSync, constants } from 'fs'
import Context from '../context'

const { X_OK } = constants


/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'sets the correct permissions'({ SOURCE, TEMP, BIN }) {
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
