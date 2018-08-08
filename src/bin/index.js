#!/usr/bin/env node
import argufy from 'argufy'
import readDirStructure from '@wrote/read-dir-structure'
import ensurePath from '@wrote/ensure-path'
import usually from 'usually'
import { Replaceable } from 'restream'
import { resolve, join } from 'path'
import ALaImport from '@a-la/import'
import { createReadStream, createWriteStream } from 'fs'
import { debuglog } from 'util'
import catcher from './catcher'

const LOG = debuglog('alamode')

const {
  input: _input,
  output: _output,
} = argufy({
  input: { command: true },
  output: { short: 'o' },
})

const processFile = async (input, relPath, name, output) => {
  const inputPath = resolve(input, relPath, name)
  const outputPath = resolve(output, relPath, name)
  const p = join(relPath, name)
  LOG(p)

  const replaceable = new Replaceable([
    ...ALaImport,
  ])
  await ensurePath(outputPath)

  const rs = createReadStream(inputPath)
  const ws = createWriteStream(outputPath)
  rs.pipe(replaceable).pipe(ws)
  await new Promise((r, j) => {
    rs.on('error', j)
    replaceable.on('error', j)
    ws.on('error', j)

    ws.on('close', r)
  })
}

const processDir = async (input, dirContent, output, relPath = '.') => {
  const k = Object.keys(dirContent)
  await k.reduce(async (acc, name) => {
    await acc
    // const p = resolve(input, name) // path to the file or dir
    const { type, content } = dirContent[name]
    if (type == 'File') {
      await processFile(input, relPath, name, output)
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir(input, content, output, newRelPath)
    }
  }, Promise.resolve())
}

;(async () => {
  try {
    if (!_input) throw new Error('Please specify input directory')
    if (!_output) throw new Error('Please specify output directory')
    const { content, type } = await readDirStructure(_input)
    if (type == 'Directory') {
      await processDir(_input, content, _output)
      // run dir
    } else if (type == 'file') {
      // run file
      await processFile(_input, '.', '.', _output)
    }
    // console.log(structure)
  } catch (err) {
    catcher(err)
  }
})()