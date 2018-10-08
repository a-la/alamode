const { join, basename, dirname } = require('path');
const { lstatSync } = require('fs');
let readDirStructure = require('@wrote/read-dir-structure'); if (readDirStructure && readDirStructure.__esModule) readDirStructure = readDirStructure.default;
let ensurePath = require('@wrote/ensure-path'); if (ensurePath && ensurePath.__esModule) ensurePath = ensurePath.default;
const { debuglog } = require('util');
const { copyMode } = require('../lib');
const writeSourceMap = require('../lib/source-map');
const { transformStream } = require('../lib/transform');
let whichStream = require('which-stream'); if (whichStream && whichStream.__esModule) whichStream = whichStream.default;

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
}) => {
  const path = join(input, relPath)
  const { content } = await readDirStructure(path)
  const k = Object.keys(content)
  await k.reduce(async (acc, name) => {
    await acc
    const { type } = content[name]
    if (type == 'File') {
      await processFile({
        input, relPath, name, output, ignore, noSourceMaps,
        extensions,
      })
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir({
        input,
        output,
        ignore,
        relPath: newRelPath,
        noSourceMaps,
        extensions,
      })
    }
  }, {})
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
    })
  } else if (ls.isFile()) {
    await processFile({
      input: dirname(input),
      relPath: '.',
      name: basename(input),
      output,
      ignore,
      noSourceMaps,
      extensions,
    })
  }
  if (output != '-') process.stdout.write(`Transpiled code saved to ${output}\n`)
}


module.exports.transpile = transpile