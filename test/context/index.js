import { resolve } from 'path'
import { debuglog } from 'util'
import { unlink, rmdir, createReadStream } from 'fs'
import ensurePath from '@wrote/ensure-path'
import readDirStructure from '@wrote/read-dir-structure'
import Catchment from 'catchment'
import { fork } from 'spawncommand'
import bosom from 'bosom'

const read = async (src) => {
  const rs = createReadStream(src)
  const { promise } = new Catchment({ rs })
  const res = await promise
  return res
}

const removeDir = async (path) => {
  const { content } = await readDirStructure(path)
  const files = Object.keys(content).filter((k) => {
    const { type } = content[k]
    if (type == 'File') return true
  })
  const dirs = Object.keys(content).filter((k) => {
    const { type } = content[k]
    if (type == 'Directory') return true
  })
  const filesFullPaths = files.map(file => resolve(path, file))
  await Promise.all(
    filesFullPaths.map(unlinkPromise)
  )
  const dirsFullPaths = dirs.map(dir => resolve(path, dir))
  await Promise.all(
    dirsFullPaths.map(removeDir)
  )
  await new Promise((r, j) => {
    rmdir(path, (err) => {
      err ? j(err) : r()
    })
  })
}

const LOG = debuglog('alamode')

const FIXTURE = resolve(__dirname, '../fixture')
const TEMP = resolve(__dirname, '../temp')

const unlinkPromise = async (path) => {
  await new Promise((r, j) => {
    unlink(path, (err) => {
      err ? j(err) : r()
    })
  })
}

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    await ensurePath(resolve(TEMP, 'temp'))
  }
  async writeRc(config) {
    await bosom(this.TEMP_RC_PATH, config, { space: 2 })
  }
  get TEMP_RC_PATH() {
    return resolve(TEMP, '.alamoderc.json')
  }
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return resolve(FIXTURE, 'test.txt')
  }
  get JS_FIXTURE() {
    return resolve(FIXTURE, 'fixture.js')
  }
  async readFile(path) {
    const res = await read(path)
    return res
  }
  /**
   * Path to a fixture file which contains template literals with import and export statements.
   * @example
   * const e = `
  export { test } from 'test'
`
   */
  get ADVANCED_FIXTURE() {
    return resolve(FIXTURE, 'advanced.js')
  }
  get SOURCE() {
    return resolve(FIXTURE, 'src')
  }
  get OUTPUT() {
    return resolve(TEMP, 'build')
  }
  get TEMP() {
    return TEMP
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  async _destroy() {
    LOG('destroy context')
    await removeDir(TEMP)
  }
  /**
   * Path to alamode binary.
   */
  get BIN() {
    return BIN
  }
  async fork(args) {
    const { promise, stdout, stderr } = fork(this.BIN, args, {
      stdio: 'pipe',
      env: {
        NODE_DEBUG: 'alamode',
      },
      execArgv: [],
      cwd: this.TEMP,
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
    return { stdout: so, stderr: se }
  }
}

const ALAMODE = process.env.ALAMODE_ENV == 'test-build' ? '../../build/bin' : '../../src/bin/alamode'
const BIN = resolve(__dirname, ALAMODE)