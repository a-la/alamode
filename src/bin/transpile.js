import { join, basename, dirname, relative } from 'path'
import { lstatSync } from 'fs'
import clone from '@wrote/clone'
import { ensurePath, readDirStructure, write } from '@wrote/wrote'
import whichStream from 'which-stream'
import { debuglog } from 'util'
import { copyMode, getConfig } from '../lib'
import writeSourceMap, { getMap } from '../lib/source-map'
import { transformStream } from '../lib/transform'
import { getJSX } from '../lib/jsx'

const LOG = debuglog('alamode')

/**
 * @param {Array<string>} ignore
 * @param {string} file
 */
const shouldIgnore = (ignore, file) => {
  return ignore.includes(file) || ignore.some(i => {
    return file.startsWith(`${i}/`)
  })
}

/**
 * Transform for modules.
 * @param {Config} conf
 * @return {Promise<string>} The location where the file was saved.
 */
const processFile = async (conf) => {
  const {
    input, relPath = '.', name, output = '-', noSourceMaps,
    extensions, debug, outputName = name, renameOnly,
  } = conf
  const file = join(relPath, name)

  const isOutputStdout = output == '-'
  const source = join(input, file)

  const outputDir = isOutputStdout ? null : join(output, relPath)
  const destination = isOutputStdout ? '-' : join(/** @type {string} */ (outputDir),
    outputName)
  LOG(file)

  await ensurePath(destination)

  if (!shouldProcess(file, extensions)) {
    await whichStream({
      source, destination,
    })
    return destination
  }

  const originalSource = await transformStream({
    source,
    destination,
    debug,
    noSourceMaps,
    renameOnly,
  })

  if (output != '-') {
    copyMode(source, destination)
    if (noSourceMaps) return destination
    writeSourceMap({
      destination,
      file,
      name,
      outputDir,
      source,
      originalSource,
    })
  } else if (!noSourceMaps && !debug) {
    const map = getMap({
      file,
      originalSource,
      pathToSrc: relative(outputDir || '', source),
    })
    const b64 = Buffer.from(map).toString('base64')
    const s = `/`+`/# sourceMappingURL=data:application/json;charset=utf-8;base64,${b64}`
    console.log('\n\n%s', s)
  }
  return destination
}

/**
 * Transforms the whole directory.
 * @param {Config} conf
 */
const processDir = async (conf) => {
  const { input, output, relPath = '.', jsx, preact, renameOnly } = conf
  const path = join(input, relPath)
  const outputDir = join(output, relPath)
  const { content } = await readDirStructure(path)
  const k = Object.keys(/** @type {!Object} */ (content))
  await k.reduce(async (acc, name) => {
    await acc
    const file = join(path, name)
    const { type } = content[name]
    if (type == 'File') {
      if (shouldIgnore(conf.ignore, join(relPath, name))) return

      if (jsx && isJSX(name)) {
        let File = file
        if (conf.mod) {
          const outputName = name.replace(/jsx$/, 'js')
          File = await processFile({ ...conf, name, outputName })
          name = outputName
        } else if (renameOnly) {
          File = await processFile({ ...conf, name, renameOnly })
        }

        const out = join(outputDir, name)
        await processJSX(File, preact, output, out, {
          relPath, name, ignore: conf.ignore, mod: conf.mod,
        })
      } else if (jsx && conf.mod) {
        await processFile({ ...conf, name })
      } else if (jsx) {
        await clone(file, outputDir)
      } else {
        await processFile({ ...conf, name })
      }
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir({
        ...conf,
        relPath: newRelPath,
      })
    }
  }, {})
}

/**
 * Processes the JSX file.
 * @param {string} file The real path source file.
 * @param {boolean} preact Whether to add Preact pragma.
 * @param {string} output The output dir.
 * @param {string} out The out file.
 */
const processJSX = async (file, preact, output, out, { mod, relPath, name, ignore } = {}) => {
  if (ignore) { // processing dir
    const f = join(relPath, name)
    if (shouldIgnore(ignore, f)) return
  }

  const res = await getJSX(file, preact, output, mod)
  const p = out.replace(/jsx$/, 'js')
  if (out == '-') return res
  await ensurePath(p)
  await write(p, res)
}

const shouldProcess = (name, extensions) => {
  return extensions.some(e => name.endsWith(e))
}

/**
 * Entry point to modules transpilation.
 * @param {Config} conf
 */
export const transpile = async (conf) => {
  const { input, output = '-', jsx, preact } = conf
  if (!input) throw new Error('Please specify the source file or directory.')

  const ls = lstatSync(input)

  if (ls.isDirectory()) {
    if (output == '-')
      throw new Error('Output to stdout is only for files.')

    const alamodeConf = getConfig()
    const renameOnly = alamodeConf.import && alamodeConf.import.replacement
    await processDir({ ...conf, renameOnly })
  } else if (ls.isFile()) {
    const name = basename(input)
    if (jsx && isJSX(name)) {
      const out = output == '-' ? '-' : join(output, name)
      const res = await processJSX(input, preact, output, out)
      if (out == '-') return console.log(res)
    } else
      await processFile({
        ...conf,
        input: dirname(input),
        relPath: './',
        name,
      })
  }
  if (output != '-') process.stdout.write(`Transpiled code saved to ${output}\n`)
}

const isJSX = name => /jsx$/.test(name)

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} Config
 * @prop {string} input
 * @prop {string} output
 * @prop {boolean} noSourceMaps
 * @prop {boolean} debug
 * @prop {boolean} renameOnly
 * @prop {string|false} preact Either the package name where to import preact, or false.
 * @prop {boolean} jsx Whether to process JSX
 * @prop {boolean} mod When processing JSX, also process modules.
 * @prop {Array<string>} ignore
 * @prop {Array<string>} extensions
 */

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').Config} _alamode.Config
 */