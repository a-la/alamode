import { join, basename, dirname, relative } from 'path'
import { lstatSync, readFileSync, writeFileSync, existsSync } from 'fs'
import clone from '@wrote/clone'
import {
  ensurePath, readDirStructure, read, write,
} from '@wrote/wrote'
import whichStream from 'which-stream'
import { c } from 'erte'
import { debuglog } from 'util'
import transpileJSX from '@a-la/jsx'
import { copyMode } from '../lib'
import writeSourceMap from '../lib/source-map'
import { transformStream } from '../lib/transform'

const LOG = debuglog('alamode')

const processFile = async ({
  input, relPath, name, output, ignore, noSourceMaps,
  extensions, debug,
}) => {
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
  }
}

const processDir = async ({
  input,
  output,
  relPath = '.',
  ignore = [],
  noSourceMaps,
  extensions,
  jsx,
  preact,
  debug,
}) => {
  if (output == '-')
    throw new Error('Output to stdout is only for files.')
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
        await processFile({
          input, relPath, name, output, ignore, noSourceMaps,
          extensions, jsx, debug,
        })
      }
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir({
        input,
        output,
        ignore,
        relPath: newRelPath,
        noSourceMaps,
        extensions,
        jsx,
        debug,
      })
    }
  }, {})
}

function __$styleInject(css = '') {
  try { if (!document) return } catch (err) { return }
  const head = document.head
  const style = document.createElement('style')
  style.type = 'text/css'
  if (style.styleSheet){
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  head.appendChild(style)
}

const getJSX = async (file, preact, output) => {
  const source = await read(file)
  let transpiled = await transpileJSX(source, {
    quoteProps: 'dom',
    warn(message) {
      console.warn(c(message, 'yellow'))
      console.warn(c(' in %s', 'grey'), file)
    },
  })
  transpiled = transpiled.replace(/^import (['"])(.+?\.css)\1/gm, (m, q, p) => {
    try {
      const i = join(output, 'css-injector.js')
      const e = existsSync(i)
      if (!e) writeFileSync(i, `export default ${__$styleInject.toString()}`)
      const path = join(dirname(file), p)
      const cssJsName = `${p}.js`
      const cssOutput = join(output, cssJsName)

      let rel = relative(dirname(cssOutput), i)
      if (!rel.startsWith('.')) rel = `./${rel}`
      const css = readFileSync(path)
      let s = `import __$styleInject from '${rel}'\n\n`
      s += `__$styleInject(\`${css}\`)`

      writeFileSync(cssOutput, s)
      console.error('Added %s in %s', c(cssJsName, 'yellow'), file)
      return `import ${q}${cssJsName}${q}`
    } catch (err) {
      console.error('Could not include CSS in %s:\n%s', file, c(err.message, 'red'))
      return m
    }
  })
  if (preact) return `import { h } from 'preact'
${transpiled}`
  return transpiled
}

const shouldProcess = (name, extensions) => {
  return extensions.some(e => name.endsWith(e))
}

export const transpile = async ({
  input,
  output = '-',
  ignore = [],
  noSourceMaps,
  extensions,
  jsx,
  preact,
  debug,
}) => {
  if (!input) throw new Error('Please specify the source file or directory.')

  const ls = lstatSync(input)
  if (ls.isDirectory()) {
    if (!output) throw new Error('Please specify the output directory.')
    await processDir({
      input,
      output,
      ignore,
      noSourceMaps,
      extensions,
      jsx,
      preact,
      debug,
    })
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
        input: dirname(input),
        relPath: '.',
        name,
        output,
        ignore,
        noSourceMaps,
        extensions,
        preact,
        debug,
      })
  }
  if (output != '-') process.stdout.write(`Transpiled code saved to ${output}\n`)
}

const isJSX = name => /jsx$/.test(name)
