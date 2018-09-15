import TempContext from 'temp-context'
import { accessSync, constants } from 'fs'
import { join } from 'path'
import Context from '../context'

const { X_OK } = constants

/** @type {Object.<string, (c: Context, tc: TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'sets the correct permissions'({ SOURCE, fork }, { TEMP }) {
    const file = 'index.js'
    const s = join(SOURCE, file)
    await fork([s, '-o', TEMP])
    const j = join(TEMP, file)
    accessSync(j, X_OK)
  },
}

export default T
