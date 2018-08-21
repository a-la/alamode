#!/usr/bin/env node
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
let readDirStructure = require('@wrote/read-dir-structure'); if (readDirStructure && readDirStructure.__esModule) readDirStructure = readDirStructure.default;
let ensurePath = require('@wrote/ensure-path'); if (ensurePath && ensurePath.__esModule) ensurePath = ensurePath.default;
let usually = require('usually'); if (usually && usually.__esModule) usually = usually.default;
const {
  Replaceable,
  makeMarkers, makeCutRule, makePasteRule,
} = require('restream')
const { resolve, join } = require('path')
let ALaImport = require('@a-la/import'); if (ALaImport && ALaImport.__esModule) ALaImport = ALaImport.default;
let ALaExport = require('@a-la/export'); if (ALaExport && ALaExport.__esModule) ALaExport = ALaExport.default;
const { createReadStream, lstatSync } = require('fs')
const { debuglog } = require('util')
let whichStream = require('which-stream'); if (whichStream && whichStream.__esModule) whichStream = whichStream.default;
let Catchment = require('catchment'); if (Catchment && Catchment.__esModule) Catchment = Catchment.default;
const { version } = require('../../package.json')
let catcher = require('./catcher'); if (catcher && catcher.__esModule) catcher = catcher.default;
const { copyMode, commentsRe, inlineCommentsRe } = require('../lib')
let writeSourceMap = require('../lib/source-map'); if (writeSourceMap && writeSourceMap.__esModule) writeSourceMap = writeSourceMap.default;

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
  const file = join(relPath, name)
  LOG(file)

  const { comments, inlineComments } = makeMarkers({
    comments: commentsRe,
    inlineComments: inlineCommentsRe,
    string: /'(.*)'/gm,
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
  const { promise: sourcePromise } = new Catchment({ rs: readable })

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

  const source = await sourcePromise

  if (outputPath != '-') {
    copyMode(inputPath, outputPath)
    writeSourceMap({
      source,
      inputPath, output, name, relPath,
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
//# sourceMappingURL=index.js.map