import { resolve } from 'path'
import { fork } from 'spawncommand'
import { collect } from 'catchment'

const ALAMODE = process.env.ALAMODE_ENV == 'test-build'
  ? '../../build/bin'
  : '../../src/bin/alamode'
const BIN = resolve(__dirname, ALAMODE)

const FIXTURE = resolve(__dirname, '../fixture')

/**
 * A testing context for the package.
 */
export default class Context {
  get BIN() {
    return BIN
  }
  get JS_FIXTURE() {
    return resolve(FIXTURE, 'fixture.js')
  }
  get SOURCE() {
    return resolve(FIXTURE, 'src')
  }
  async fork(args, cwd) {
    const { promise, stdout, stderr } = fork(BIN, args, {
      stdio: 'pipe',
      cwd,
      execArgv: [],
    })
    const [, so, se] = await Promise.all([
      promise,
      collect(stdout),
      collect(stderr),
    ])
    return { stdout: so, stderr: se }
  }
}
