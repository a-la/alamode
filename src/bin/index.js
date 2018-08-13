#!/usr/bin/env node
import argufy from 'argufy'
import readDirStructure from '@wrote/read-dir-structure'
import ensurePath from '@wrote/ensure-path'
import usually from 'usually'
import {
  Replaceable,
  makeMarkers, makeCutRule, makePasteRule,
} from 'restream'
import { resolve, join } from 'path'
import ALaImport from '@a-la/import'
import ALaExport from '@a-la/export'
import { createReadStream, lstatSync } from 'fs'
import { debuglog } from 'util'
import whichStream from 'which-stream'
import { version } from '../../package.json'
import catcher from './catcher'
import { copyMode } from '../lib'

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
  const inputPath = resolve(input, relPath, name)
  const outputPath = output == '-' ? '-' : resolve(output, relPath, name)
  const p = join(relPath, name)
  LOG(p)

  const { comments, inlineComments } = makeMarkers({
    comments: /\/\*(?:[\s\S]+?)\*\//g,
    inlineComments: /\/\/(.+)/gm,
  })
  const mr = [comments, inlineComments]
  const [cutComments, cutInlineComments] = mr
    .map(makeCutRule)
  const [pasteComments, pasteInlineComments] = mr
    .map(makePasteRule)

  const replaceable = new Replaceable([
    cutComments,
    cutInlineComments,
    ...ALaImport,
    ...ALaExport,
    pasteInlineComments,
    pasteComments,
  ])
  await ensurePath(outputPath)

  const readable = createReadStream(inputPath)
  readable.pipe(replaceable)

  await Promise.all([
    whichStream({
      source: inputPath,
      readable: replaceable,
      destination: outputPath,
    }),
    new Promise((r, j) => {
      readable.once('error', j)
      replaceable.once('error', j)
      replaceable.once('end', r)
    }),
  ])

  if (outputPath != '-') copyMode(inputPath, outputPath)
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

const run = async () => {
  if (!_input) throw new Error('Please specify the source file or directory.')

  const ls = lstatSync(_input)
  if (ls.isDirectory()) {
    if (!_output) throw new Error('Please specify the output directory.')
    await processDir(_input, _output)
  } else if (ls.isFile()) {
    const output = _output || '-'
    await processFile(_input, '.', '.', output)
  }
  if (_output != '-') process.stdout.write(`Transpiled code saved to ${_output}\n`)
}

(async () => {
  try {
    await run()
  } catch (err) {
    catcher(err)
  }
})()