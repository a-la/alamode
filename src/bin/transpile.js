import { join, basename, dirname } from 'path'
import { lstatSync } from 'fs'
import readDirStructure from '@wrote/read-dir-structure'
import ensurePath from '@wrote/ensure-path'
import { debuglog } from 'util'
import { copyMode } from '../lib'
import writeSourceMap from '../lib/source-map'
import { transformStream } from '../lib/transform'
import whichStream from 'which-stream'

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

export const transpile = async ({
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
