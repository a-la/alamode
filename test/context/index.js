import { join } from 'path'

const ALAMODE = process.env.ALAMODE_ENV == 'test-build'
  ? '../../build/bin/alamode'
  : '../../src/bin'
const BIN = join(__dirname, ALAMODE)

const FIXTURE = join(__dirname, '../fixture')

/**
 * A testing context for the package.
 */
export default class Context {
  /**
   * Path to the executable binary.
   */
  static get BIN() {
    return BIN
  }
  get JS_FIXTURE() {
    return join(FIXTURE, 'fixture.js')
  }
  get SOURCE() {
    return join(FIXTURE, 'src')
  }
  get index() {
    return join(this.SOURCE, 'index.js')
  }
}