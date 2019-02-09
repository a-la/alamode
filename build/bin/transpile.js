const { join, basename, dirname } = require('path');
const { lstatSync } = require('fs');
let clone = require('@wrote/clone'); if (clone && clone.__esModule) clone = clone.default;
const {
  ensurePath, readDirStructure, read, write,
} = require('@wrote/wrote');
let whichStream = require('which-stream'); if (whichStream && whichStream.__esModule) whichStream = whichStream.default;
const { c } = require('erte');
const { debuglog } = require('util');
let transpileJSX = require('@a-la/jsx'); if (transpileJSX && transpileJSX.__esModule) transpileJSX = transpileJSX.default;
const { copyMode } = require('../lib');
const writeSourceMap = require('../lib/source-map');
const { transformStream } = require('../lib/transform');

const LOG = debuglog('alamode')

const processFile = async ({
  input, relPath, name, output, ignore, noSourceMaps,
  extensions,
}) => {
  const file = join(relPath, name)
  if (ignore.includes(file)) {
    return
  }

  const isOutputStdout = output == '-'
  const source = join(input, file)

  const outputDir = isOutputStdout ? null : join(output, relPath)
  const destination = isOutputStdout ? '-' : join(outputDir, name)
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
}) => {
  if (output == '-')
    throw new Error('Output to stdout is only for files.')
  const path = join(input, relPath)
  const outputDir = join(output, relPath)
  const { content } = await readDirStructure(path)
  const k = Object.keys(content)
  await k.reduce(async (acc, name) => {
    await acc
    const file = join(path, name)
    const out = join(outputDir, name)
    const { type } = content[name]
    if (type == 'File') {
      if (jsx && isJSX(name)) {
        const res = await getJSX(file, preact)
        const p = out.replace(/jsx$/, 'js')
        await ensurePath(p)
        await write(p, res)
      } else if (jsx) {
        await clone(file, outputDir)
      } else {
        await processFile({
          input, relPath, name, output, ignore, noSourceMaps,
          extensions, jsx,
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
      })
    }
  }, {})
}

const getJSX = async (file, preact) => {
  const source = await read(file)
  const transpiled = await transpileJSX(source, {
    quoteProps: 'dom',
    warn(message) {
      console.warn(c(message, 'yellow'))
      console.log(file)
    },
  })
  if (preact) return `import { h } from 'preact'
${transpiled}`
  return transpiled
}

const shouldProcess = (name, extensions) => {
  return extensions.some(e => name.endsWith(e))
}

       const transpile = async ({
  input,
  output = '-',
  ignore = [],
  noSourceMaps,
  extensions,
  jsx,
  preact,
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
    })
  } else if (ls.isFile()) {
    const name = basename(input)
    if (jsx && isJSX(name)) {
      const out = output == '-' ? '-' : join(output, name)
      const res = await getJSX(input, preact)
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
      })
  }
  if (output != '-') process.stdout.write(`Transpiled code saved to ${output}\n`)
}

const isJSX = name => /jsx$/.test(name)


module.exports.transpile = transpile