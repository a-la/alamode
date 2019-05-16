import { join, basename, dirname, relative } from 'path'
import { lstatSync } from 'fs'
import clone from '@wrote/clone'
import { ensurePath, readDirStructure, write } from '@wrote/wrote'
import whichStream from 'which-stream'
import { debuglog } from 'util'
import { copyMode } from '../lib'
import writeSourceMap, { getMap } from '../lib/source-map'
import { transformStream } from '../lib/transform'
import { getJSX } from '../lib/jsx'

const LOG = debuglog('alamode')

/**
 * @param {Config} conf
 */
const processFile = async (conf) => {
  const {
    input, relPath = '.', name, output = '-', ignore = [], noSourceMaps,
    extensions, debug,
  } = conf
  const file = join(relPath, name)
  if (ignore.includes(file) || ignore.some(i => {
    return file.startsWith(`${i}/`)
  })) {
    return
  }

  const isOutputStdout = output == '-'
  const source = join(input, file)

  const outputDir = isOutputStdout ? null : join(output, relPath)
  const destination = isOutputStdout ? '-' : join(/** @type {string} */ (outputDir), name)
  LOG(file)

  await ensurePath(destination)

  if (!shouldProcess(file, extensions)) {
    await whichStream({
      source, destination,
    })
    return
  }

  const originalSource = await transformStream({
    source,
    destination,
    debug,
    noSourceMaps,
  })

  if (output != '-') {
    copyMode(source, destination)
    if (noSourceMaps) return
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
      pathToSrc: relative(outputDir, source),
    })
    const b64 = Buffer.from(map).toString('base64')
    const s = `/`+`/# sourceMappingURL=data:application/json;charset=utf-8;base64,${b64}`
    console.log('\n\n%s', s)
  }
}

/**
 * @param {Config} conf
 */
const processDir = async (conf) => {
  const { input, output, relPath = '.', jsx, preact } = conf
  const path = join(input, relPath)
  const outputDir = join(output, relPath)
  const { content } = await readDirStructure(path)
  const k = Object.keys(/** @type {!Object} */ (content))
  await k.reduce(async (acc, name) => {
    await acc
    const file = join(path, name)
    const out = join(outputDir, name)
    const { type } = content[name]
    if (type == 'File') {
      if (jsx && isJSX(name)) {
        const res = await getJSX(file, preact, output)
        const p = out.replace(/jsx$/, 'js')
        await ensurePath(p)
        await write(p, res)
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

const shouldProcess = (name, extensions) => {
  return extensions.some(e => name.endsWith(e))
}

/**
 * @param {Config} conf
 */
export const transpile = async (conf) => {
  const { input, output = '-', jsx, preact } = conf
  if (!input) throw new Error('Please specify the source file or directory.')

  const ls = lstatSync(input)
  if (ls.isDirectory()) {
    if (output == '-')
      throw new Error('Output to stdout is only for files.')
    await processDir(conf)
  } else if (ls.isFile()) {
    const name = basename(input)
    if (jsx && isJSX(name)) {
      const out = output == '-' ? '-' : join(output, name)
      const res = await getJSX(input, preact, output)
      if (out == '-') console.log(res)
      else {
        const p = out.replace(/jsx$/, 'js')
        await ensurePath(p)
        await write(p, res)
      }
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
 * @prop {boolean} preact
 * @prop {boolean} jsx Whether to process JSX
 * @prop {Array<string>} ignore
 * @prop {Array<string>} extensions
 */