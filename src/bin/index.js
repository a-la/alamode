#!/usr/bin/env node
import argufy from 'argufy'
import readDirStructure from '@wrote/read-dir-structure'
import ensurePath from '@wrote/ensure-path'
import usually from 'usually'
import { resolve, join } from 'path'
import { lstatSync } from 'fs'
import { debuglog } from 'util'

import { version } from '../../package.json'
import catcher from './catcher'
import { copyMode } from '../lib'
import writeSourceMap from '../lib/source-map'
import { transformStream } from '../lib/transform'

const LOG = debuglog('alamode')

const {
  input: _input,
  output: _output,
  version: _version,
  help: _help,
} = argufy({
  input: { command: true },
  output: { short: 'o' },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
})

if (_help) {
  const usage = usually({
    usage: {
      source: `Location of the input to the transpiler,
either a directory or a file.`,
      '--output, -o': `Location to save results to. Passing "-"
will print to stdout when source is a file.`,
    },
    description: 'A tool to transpile JavaScript packages using regular expressions.',
    line: 'alamode source [-o destination]',
    example: 'alamode src -o build',
  })
  console.log(usage)
  process.exit()
} else if (_version) {
  console.log('v%s', version)
  process.exit()
}

const processFile = async (input, relPath, name, output) => {
  const isOutputStdout = output == '-'
  const file = join(relPath, name)
  const source = join(input, file)

  const outputDir = isOutputStdout ? null : join(output, relPath)
  const destination = isOutputStdout ? '-' : join(outputDir, name)
  LOG(file)

  await ensurePath(destination)

  const originalSource = await transformStream({
    source,
    destination,
  })

  if (output != '-') {
    copyMode(source, destination)
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

const processDir = async (input, output, relPath = '.') => {
  const path = resolve(input, relPath)
  const { content } = await readDirStructure(path)
  const k = Object.keys(content)
  await k.reduce(async (acc, name) => {
    await acc
    const { type } = content[name]
    if (type == 'File') {
      await processFile(input, relPath, name, output)
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir(input, output, newRelPath)
    }
  }, Promise.resolve())
}

const run = async (input, output = '-') => {
  if (!input) throw new Error('Please specify the source file or directory.')

  const ls = lstatSync(input)
  if (ls.isDirectory()) {
    if (!_output) throw new Error('Please specify the output directory.')
    await processDir(input, _output)
  } else if (ls.isFile()) {
    await processFile(input, '.', '.', output)
  }
  if (output != '-') process.stdout.write(`Transpiled code saved to ${output}\n`)
}

(async () => {
  try {
    await run(_input, _output)
  } catch (err) {
    catcher(err)
  }
})()