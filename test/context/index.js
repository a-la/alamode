import { resolve } from 'path'
import { debuglog } from 'util'
import { unlink, rmdir } from 'fs'
import ensurePath from '@wrote/ensure-path'
import readDirStructure from '@wrote/read-dir-structure'

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
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return resolve(FIXTURE, 'test.txt')
  }
  get JS_FIXTURE() {
    return resolve(FIXTURE, 'fixture.js')
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
}
