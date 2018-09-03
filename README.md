# alamode

[![npm version](https://badge.fury.io/js/alamode.svg)](https://npmjs.org/package/alamode)

`alamode` is  a RegExp-based transpiler of source code in Node.js. It is a fast, low-weight alternative to AST-based transpilers, such as `@babel`. At the moment, it supports transpilation of `import` and `export` statements which also improves JSDoc support compared to _Babel_.

```
yarn add -DE alamode
```

The package can be used via the [CLI](#CLI) to build packages, or via the [require hook](#require-hook) to transform modules on-the-fly.

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Installation](#installation)
  * [Global](#global)
  * [Project](#project)
- [CLI](#cli)
  * [Output Location](#output-location)
  * [Watch Mode](#watch-mode)
  * [Show Help](#show-help)
  * [Ignore Paths](#ignore-paths)
  * [No Source Maps](#no-source-maps)
  * [Advanced](#advanced)
  * [`NODE_DEBUG`](#node_debug)
- [.alamoderc.json](#alamodercjson)
  * [`advanced`](#advanced)
- [Transforms](#transforms)
  * [`@a-la/import`](#a-laimport)
    * [Replace Path](#replace-path)
  * [`@a-la/export`](#a-laexport)
  * [Advanced Mode](#advanced-mode)
- [Modes](#modes)
- [Require Hook](#require-hook)
- [Source Maps](#source-maps)
  * [<code>debug session</code>](#debug-session)
- [Troubleshooting](#troubleshooting)
- [TODO](#todo)
- [Copyright](#copyright)

## Installation

The software can be installed either as a global dependency, or as a project dependency.

### Global

When installed globally, it will be used directly via a binary, such as `alamode src -o build`.

| Package Manager | Installation |
| --------------- | ------------ |
| <img src='https://cdn.rawgit.com/a-la/alamode/HEAD/doc/Npm-logo.svg' height='16'> npm | `npm i -g alamode` |
| <img src='https://cdn.rawgit.com/a-la/alamode/HEAD/doc/yarn-kitten.svg' height='16'> yarn | `yarn add global alamode` |

### Project

When installed in a project, it will be used via the `package.json` script, e.g., `yarn build` or `npm run build`.

```json5
// package.json
{
  "name": "project",
  "version": "1.0.0",
  "description": "An example project",
  "main": "build",
  "scripts": {
    "build": "alamode src -o build"
  },
  "files": ["build"],
  "license": "MIT"
}
```

| Package Manager | Installation |
| --------------- | ------------ |
| <img src='https://cdn.rawgit.com/a-la/alamode/HEAD/doc/Npm-logo.svg' height='16'> npm | `npm i --save-dev alamode` |
| <img src='https://cdn.rawgit.com/a-la/alamode/HEAD/doc/yarn-kitten.svg' height='16'> yarn | `yarn add -DE alamode` |
## CLI

The binary accepts a path to a single file, or a directory with the source code as the first argument, and a path to the build folder via `-o` argument.

```sh
alamode src -o build
```

There are other arguments which can be passed.

| Property | Argument | Description |
| -------- | -------- | ----------- |
| <a name="output-location">Output Location</a> | `-o`, `--output` | Where to save transpiled code. Passing `-` will print to `stdout`. |
| <a name="watch-mode">Watch Mode</a> | `-w`, `--watch` | Keep `alamode` running and re-build on chages. |
| <a name="show-help">Show Help</a> | `-h`, `--help` | Display help information and quit. |
| <a name="ignore-paths">Ignore Paths</a> | `-i`, `--ignore` | A list of files inside of the source directory to ignore, separated with a comma. For example, to ignore `src/bin/alamode.js` when building `src`, the `-i bin/alamode.js` should be passed |
| <a name="no-source-maps">No Source Maps</a> | `-s`, `--noSourceMaps` | Don't generate source maps. |
| <a name="advanced">Advanced</a> | `-a`, `--advanced` | Attempt to exclude template strings from participating in transforms. [See more](#advanced-mode). |

Setting the <a name="node_debug">`NODE_DEBUG`</a> environmental variable to `alamode` will print the list of processed files to the `stderr`.

```sh
$ NODE_DEBUG=alamode alamode src -o build -i bin/alamode.js
```

```fs
ALAMODE 97955: index.js
ALAMODE 97955: bin/catcher.js
ALAMODE 97955: bin/index.js
ALAMODE 97955: lib/index.js
```
## .alamoderc.json

A transform can support options which can be set in the `.alamoderc.json` configuration file which is read from the same directory where the program is executed. Options inside of the `env` directive will be active only when the `ALAMODE_ENV` environmental variable is set to the `env` key.

```json
{
  "env": {
    "test-build": {
      "import": {
        "replacement": {
          "from": "^((../)+)src",
          "to": "$1build"
        }
      }
    }
  }
}
```

### `advanced`

When set in the `.alamoderc`, the `advanced` option will make transforms run in the [advanced mode](#advanced-mode).

## Transforms

There are a number of built-in transforms, which don't need to be installed separately because their size is small enough to be included as direct dependencies.

### `@a-la/import`

Changes all `import` statements into `require` statements. Although the specification between the [ECMAScript Modules](https://nodejs.org/api/esm.html) and [Modules](https://nodejs.org/api/modules.html) is different, most developers will prefer to use `import` just because of its neater syntax.

```js
import argufy from 'argufy'
import restream, {
  Replaceable,
  makeMarkers, makeCutRule, makePasteRule,
} from 'restream'
import { resolve, join } from 'path'
import { version } from '../../package.json'
```

```js
123
#!/usr/bin/env node
import argufy from 'argufy'
import { version } from '../../package.json'
import catcher from './catcher'
import { transpile } from './transpile'
import getUsage from './usage'

const {
  input: _input,
  output: _output,
  version: _version,
  help: _help,
  ignore: _ignore,
  noSourceMaps: _noSourceMaps,
  advanced: _advanced,
} = argufy({
  input: { command: true },
  output: { short: 'o' },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
  ignore: { short: 'i' },
  noSourceMaps: { short: 's', boolean: true },
  advanced: { short: 'a', boolean: true },
})

if (_help) {
  const usage = getUsage()
  console.log(usage)
  process.exit()
} else if (_version) {
  console.log('v%s', version)
  process.exit()
}

(async () => {
  try {
    const ignore = _ignore ? _ignore.split(','): []
    await transpile({
      input: _input,
      output: _output,
      noSourceMaps: _noSourceMaps,
      ignore,
      advanced: _advanced,
    })
  } catch (err) {
    catcher(err)
  }
})()
123
123
import { debuglog } from 'util'

const LOG = debuglog('alamode')
const DEBUG = /alamode/.test(process.env.NODE_DEBUG)

const catcher = (err) => {
  let stack
  let message
  if (err instanceof Error) {
    ({ stack, message } = err)
  } else {
    stack = message = err
  }
  DEBUG ? LOG(stack) : console.log(message)
  process.exit(1)
}

export default catcher
123
123
import { join, basename, dirname } from 'path'
import { lstatSync } from 'fs'
import readDirStructure from '@wrote/read-dir-structure'
import ensurePath from '@wrote/ensure-path'
import { debuglog } from 'util'
import { copyMode } from '../lib'
import writeSourceMap from '../lib/source-map'
import { transformStream } from '../lib/transform'

const LOG = debuglog('alamode')

const processFile = async ({
  input, relPath, name, output, ignore, noSourceMaps, advanced,
}) => {
  const file = join(relPath, name)
  if (ignore.includes(file)) return

  const isOutputStdout = output == '-'
  const source = join(input, file)

  const outputDir = isOutputStdout ? null : join(output, relPath)
  const destination = isOutputStdout ? '-' : join(outputDir, name)
  LOG(file)

  await ensurePath(destination)

  const originalSource = await transformStream({
    source,
    destination,
    advanced,
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
  advanced,
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
      })
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir({
        input,
        output,
        ignore,
        relPath: newRelPath,
        noSourceMaps,
        advanced,
      })
    }
  }, Promise.resolve())
}

export const transpile = async ({
  input,
  output = '-',
  ignore = [],
  noSourceMaps,
  advanced,
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
      advanced,
    })
  } else if (ls.isFile()) {
    await processFile({
      input: dirname(input),
      relPath: '.',
      name: basename(input),
      output,
      ignore,
      noSourceMaps,
      advanced,
    })
  }
  if (output != '-') process.stdout.write(`Transpiled code saved to ${output}\n`)
}

123
123
import { chmodSync, lstatSync } from 'fs'

export const copyMode = (input, output) => {
  const ls = lstatSync(input)
  const { mode } = ls
  chmodSync(output, mode)
}
123
123
import { relative, join } from 'path'
import { appendFileSync, writeFileSync } from 'fs'
import { SourceMapGenerator } from 'source-map'
import { inlineCommentsRe, commentsRe } from '@a-la/markers/build/lib'

export const getMap = ({
  file,
  originalSource,
  pathToSrc,
  sourceRoot,
}) => {
  const gen = new SourceMapGenerator({
    file,
    sourceRoot,
  })
  const linesInSource = originalSource
    .replace(commentsRe, (match, pos) => {
      const next = originalSource[pos + match.length]
      if (next == '\n') return '\n'.repeat(match.split('\n').length - 1)

      const lines = match.split('\n')
      const lastLineI = lines.length - 1
      const lastLine = lines[lastLineI]
      const ss = ' '.repeat(lastLine.length)
      const ws = '\n'.repeat(lastLineI)
      return `${ws}${ss}`
    })
    .replace(inlineCommentsRe, (match) => {
      return ' '.repeat(match.length)
    })
    .split('\n')
  linesInSource.forEach((l, i) => {
    const line = i + 1
    l
      .replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (match, column) => {
        if (column == 0 && /^\s+$/.test(match)) return
        const pp = {
          line,
          column,
        }
        const m = {
          generated: pp,
          source: pathToSrc,
          original: pp,
        }
        gen.addMapping(m)
      })
  })
  gen.setSourceContent(pathToSrc, originalSource)
  const sourceMap = gen.toString()
  return sourceMap
}

export default function addSourceMap({
  source, outputDir, name, destination, file, originalSource,
}) {
  const pathToSrc = relative(outputDir, source)

  const map = getMap({
    file, originalSource, pathToSrc,
  })

  const sourceMapName = `${name}.map`
  const comment = `\n%%_RESTREAM_INLINECOMMENTS_REPLACEMENT_0_%%
  appendFileSync(destination, comment)

  const sourceMapPath = join(outputDir, sourceMapName)
  writeFileSync(sourceMapPath, map)
}
123
123
import { Replaceable } from 'restream'
import makeRules, { makeAdvancedRules } from '@a-la/markers'
import ALaImport, { advancedSeq as advancedALaImport } from '@a-la/import'
import ALaExport, { advancedSeq as advancedALaExport } from '@a-la/export'
import whichStream from 'which-stream'
import Catchment from 'catchment'
import { createReadStream } from 'fs'
import { basename, dirname, join } from 'path'
import { getMap } from './source-map'

const getConfig = () => {
  let config = {}
  try {
    const r = join(process.cwd(), '.alamoderc.json')
    config = require(r)
  } catch (err) {
    return config
  }
  const { env: { ALAMODE_ENV } } = process
  const c = config.env && ALAMODE_ENV in config.env ? config.env[ALAMODE_ENV] : config

  delete c.env

  return c
}

const getRules = (advanced) => {
  const r = advanced ? [
    ...advancedALaImport,
    ...advancedALaExport,
  ] : [
    ...ALaImport,
    ...ALaExport,
  ]
  const mr = advanced ? makeAdvancedRules : makeRules
  const { rules, markers } = mr(r)
  return { rules, markers }
}

const makeReplaceable = (advanced) => {
  const config = getConfig()
  const { rules, markers } = getRules(config.advanced || advanced)

  const replaceable = new Replaceable(rules)
  replaceable.markers = markers

  replaceable.config = config
  return replaceable
}

%%_RESTREAM_COMMENTS_REPLACEMENT_0_%%
export const transformStream = async ({
  source,
  destination,
  writable,
  advanced = false,
}) => {
  const replaceable = makeReplaceable(advanced)

  const readable = createReadStream(source)

  readable.pipe(replaceable)
  const { promise: sourcePromise } = new Catchment({ rs: readable })

  const [,, sourceCode] = await Promise.all([
    whichStream({
      source,
      ...(writable ? { writable } : { destination }),
      readable: replaceable,
    }),
    new Promise((r, j) => {
      replaceable.once('error', j)
      replaceable.once('end', r)
    }),
    sourcePromise,
  ])

  return sourceCode
}

class Context {
  constructor(config, markers) {
    this.listeners = {}
    this.markers = markers
    this.config = config
  }
  on(event, listener) {
    this.listeners[event] = listener
  }
  emit(event, data) {
    this.listeners[event](data)
  }
  get advanced() {
    return this.config.advanced
  }
}

export const transformString = (source, advanced) => {
  const config = getConfig()
  const { rules, markers } = getRules(config.advanced || advanced)
  const context = new Context(config, markers)

  const replaced = rules.reduce((acc, { re, replacement }) => {
    const newAcc = acc.replace(re, replacement.bind(context))
    return newAcc
  }, source)
  return replaced
}

%%_RESTREAM_COMMENTS_REPLACEMENT_1_%%
export const syncTransform = (source, filename, advanced) => {
  const replaced = transformString(source, advanced)
  const file = basename(filename)
  const sourceRoot = dirname(filename)
  const map = getMap({
    originalSource: source,
    pathToSrc: file,
    sourceRoot,
  })
  const b64 = Buffer.from(map).toString('base64')
  const s = `%%_RESTREAM_INLINECOMMENTS_REPLACEMENT_0_%%

  const code = `${replaced}\n${s}`

  return code
}
123
123
import usually from 'usually'

export default () => {
  const usage = usually({
    usage: {
      source: `Location of the input to the transpiler,
either a directory or a file.`,
      '--output, -o': `Location to save results to. Passing "-"
will print to stdout when source is a file.`,
      '--help, -h': 'Display help information.',
      '--version, -v': 'Show version.',
      '--ignore, -i': `Paths to files to ignore, relative to the
source directory.`,
      '--noSourceMaps, -s': 'Don\'t generate source maps.',
      '--advanced, -a': `Attempt to skip statements inside of template
literals.`,
    },
    description: 'A tool to transpile JavaScript packages using regular expressions.',
    line: 'alamode source [-o destination]',
    example: 'alamode src -o build',
  })
  return usage
}
123
123
import argufy from 'argufy'
import restream, {
  Replaceable,
  makeMarkers, makeCutRule, makePasteRule,
} from 'restream'
import { resolve, join } from 'path'
import { version } from '../../package.json'
123
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
let restream = require('restream'); if (restream && restream.__esModule) restream = restream.default; const {
  Replaceable,
  makeMarkers, makeCutRule, makePasteRule,
} = restream
const { resolve, join } = require('path');
const { version } = require('../../package.json');
```

The `if (dependency && dependency.__esModule) dependency = dependency.default;` check is there to make `alamode` compatible with _Babel_ and _TypeScript_, which export default modules as the `default` property of `module.exports` object and set the `__esModule` marker to true, e.g.,

```js
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = method;
```

#### Replace Path

This transform supports an option to replace the path to the required file using a regular expression. This can be useful when running tests against the build directory, rather than source directory.

```json
{
  "import": {
    "replacement": {
        "from": "^((../)+)src",
          "to": "$1build"
      }
    }
  }
}
```

```js
/* yarn example/ */
import alamode from '../src'

(async () => {
  await alamode()
})()
```

```js
/* yarn example/ */
let alamode = require('../build'); if (alamode && alamode.__esModule) alamode = alamode.default;

(async () => {
  await alamode()
})()
```
### `@a-la/export`

Transforms all `export` statements into `module.exports` statements.

<table>
<thead>
<tr>
<th>Input</th>
<th>Output</th>
</tr>
</thead>
<tbody>
 <tr/>
 <tr>
  <td>

```js
export async function example () {}

const example2 = () => {}

export default class Example {
  constructor() {
    example()
  }
}

export { example2 as alias }
```
  </td>
  <td>

```js
123
#!/usr/bin/env node
import argufy from 'argufy'
import { version } from '../../package.json'
import catcher from './catcher'
import { transpile } from './transpile'
import getUsage from './usage'

const {
  input: _input,
  output: _output,
  version: _version,
  help: _help,
  ignore: _ignore,
  noSourceMaps: _noSourceMaps,
  advanced: _advanced,
} = argufy({
  input: { command: true },
  output: { short: 'o' },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
  ignore: { short: 'i' },
  noSourceMaps: { short: 's', boolean: true },
  advanced: { short: 'a', boolean: true },
})

if (_help) {
  const usage = getUsage()
  console.log(usage)
  process.exit()
} else if (_version) {
  console.log('v%s', version)
  process.exit()
}

(async () => {
  try {
    const ignore = _ignore ? _ignore.split(','): []
    await transpile({
      input: _input,
      output: _output,
      noSourceMaps: _noSourceMaps,
      ignore,
      advanced: _advanced,
    })
  } catch (err) {
    catcher(err)
  }
})()
123
123
import { debuglog } from 'util'

const LOG = debuglog('alamode')
const DEBUG = /alamode/.test(process.env.NODE_DEBUG)

const catcher = (err) => {
  let stack
  let message
  if (err instanceof Error) {
    ({ stack, message } = err)
  } else {
    stack = message = err
  }
  DEBUG ? LOG(stack) : console.log(message)
  process.exit(1)
}

export default catcher
123
123
import { join, basename, dirname } from 'path'
import { lstatSync } from 'fs'
import readDirStructure from '@wrote/read-dir-structure'
import ensurePath from '@wrote/ensure-path'
import { debuglog } from 'util'
import { copyMode } from '../lib'
import writeSourceMap from '../lib/source-map'
import { transformStream } from '../lib/transform'

const LOG = debuglog('alamode')

const processFile = async ({
  input, relPath, name, output, ignore, noSourceMaps, advanced,
}) => {
  const file = join(relPath, name)
  if (ignore.includes(file)) return

  const isOutputStdout = output == '-'
  const source = join(input, file)

  const outputDir = isOutputStdout ? null : join(output, relPath)
  const destination = isOutputStdout ? '-' : join(outputDir, name)
  LOG(file)

  await ensurePath(destination)

  const originalSource = await transformStream({
    source,
    destination,
    advanced,
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
  advanced,
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
      })
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir({
        input,
        output,
        ignore,
        relPath: newRelPath,
        noSourceMaps,
        advanced,
      })
    }
  }, Promise.resolve())
}

export const transpile = async ({
  input,
  output = '-',
  ignore = [],
  noSourceMaps,
  advanced,
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
      advanced,
    })
  } else if (ls.isFile()) {
    await processFile({
      input: dirname(input),
      relPath: '.',
      name: basename(input),
      output,
      ignore,
      noSourceMaps,
      advanced,
    })
  }
  if (output != '-') process.stdout.write(`Transpiled code saved to ${output}\n`)
}

123
123
import { chmodSync, lstatSync } from 'fs'

export const copyMode = (input, output) => {
  const ls = lstatSync(input)
  const { mode } = ls
  chmodSync(output, mode)
}
123
123
import { relative, join } from 'path'
import { appendFileSync, writeFileSync } from 'fs'
import { SourceMapGenerator } from 'source-map'
import { inlineCommentsRe, commentsRe } from '@a-la/markers/build/lib'

export const getMap = ({
  file,
  originalSource,
  pathToSrc,
  sourceRoot,
}) => {
  const gen = new SourceMapGenerator({
    file,
    sourceRoot,
  })
  const linesInSource = originalSource
    .replace(commentsRe, (match, pos) => {
      const next = originalSource[pos + match.length]
      if (next == '\n') return '\n'.repeat(match.split('\n').length - 1)

      const lines = match.split('\n')
      const lastLineI = lines.length - 1
      const lastLine = lines[lastLineI]
      const ss = ' '.repeat(lastLine.length)
      const ws = '\n'.repeat(lastLineI)
      return `${ws}${ss}`
    })
    .replace(inlineCommentsRe, (match) => {
      return ' '.repeat(match.length)
    })
    .split('\n')
  linesInSource.forEach((l, i) => {
    const line = i + 1
    l
      .replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (match, column) => {
        if (column == 0 && /^\s+$/.test(match)) return
        const pp = {
          line,
          column,
        }
        const m = {
          generated: pp,
          source: pathToSrc,
          original: pp,
        }
        gen.addMapping(m)
      })
  })
  gen.setSourceContent(pathToSrc, originalSource)
  const sourceMap = gen.toString()
  return sourceMap
}

export default function addSourceMap({
  source, outputDir, name, destination, file, originalSource,
}) {
  const pathToSrc = relative(outputDir, source)

  const map = getMap({
    file, originalSource, pathToSrc,
  })

  const sourceMapName = `${name}.map`
  const comment = `\n%%_RESTREAM_INLINECOMMENTS_REPLACEMENT_0_%%
  appendFileSync(destination, comment)

  const sourceMapPath = join(outputDir, sourceMapName)
  writeFileSync(sourceMapPath, map)
}
123
123
import { Replaceable } from 'restream'
import makeRules, { makeAdvancedRules } from '@a-la/markers'
import ALaImport, { advancedSeq as advancedALaImport } from '@a-la/import'
import ALaExport, { advancedSeq as advancedALaExport } from '@a-la/export'
import whichStream from 'which-stream'
import Catchment from 'catchment'
import { createReadStream } from 'fs'
import { basename, dirname, join } from 'path'
import { getMap } from './source-map'

const getConfig = () => {
  let config = {}
  try {
    const r = join(process.cwd(), '.alamoderc.json')
    config = require(r)
  } catch (err) {
    return config
  }
  const { env: { ALAMODE_ENV } } = process
  const c = config.env && ALAMODE_ENV in config.env ? config.env[ALAMODE_ENV] : config

  delete c.env

  return c
}

const getRules = (advanced) => {
  const r = advanced ? [
    ...advancedALaImport,
    ...advancedALaExport,
  ] : [
    ...ALaImport,
    ...ALaExport,
  ]
  const mr = advanced ? makeAdvancedRules : makeRules
  const { rules, markers } = mr(r)
  return { rules, markers }
}

const makeReplaceable = (advanced) => {
  const config = getConfig()
  const { rules, markers } = getRules(config.advanced || advanced)

  const replaceable = new Replaceable(rules)
  replaceable.markers = markers

  replaceable.config = config
  return replaceable
}

%%_RESTREAM_COMMENTS_REPLACEMENT_0_%%
export const transformStream = async ({
  source,
  destination,
  writable,
  advanced = false,
}) => {
  const replaceable = makeReplaceable(advanced)

  const readable = createReadStream(source)

  readable.pipe(replaceable)
  const { promise: sourcePromise } = new Catchment({ rs: readable })

  const [,, sourceCode] = await Promise.all([
    whichStream({
      source,
      ...(writable ? { writable } : { destination }),
      readable: replaceable,
    }),
    new Promise((r, j) => {
      replaceable.once('error', j)
      replaceable.once('end', r)
    }),
    sourcePromise,
  ])

  return sourceCode
}

class Context {
  constructor(config, markers) {
    this.listeners = {}
    this.markers = markers
    this.config = config
  }
  on(event, listener) {
    this.listeners[event] = listener
  }
  emit(event, data) {
    this.listeners[event](data)
  }
  get advanced() {
    return this.config.advanced
  }
}

export const transformString = (source, advanced) => {
  const config = getConfig()
  const { rules, markers } = getRules(config.advanced || advanced)
  const context = new Context(config, markers)

  const replaced = rules.reduce((acc, { re, replacement }) => {
    const newAcc = acc.replace(re, replacement.bind(context))
    return newAcc
  }, source)
  return replaced
}

%%_RESTREAM_COMMENTS_REPLACEMENT_1_%%
export const syncTransform = (source, filename, advanced) => {
  const replaced = transformString(source, advanced)
  const file = basename(filename)
  const sourceRoot = dirname(filename)
  const map = getMap({
    originalSource: source,
    pathToSrc: file,
    sourceRoot,
  })
  const b64 = Buffer.from(map).toString('base64')
  const s = `%%_RESTREAM_INLINECOMMENTS_REPLACEMENT_0_%%

  const code = `${replaced}\n${s}`

  return code
}
123
123
import usually from 'usually'

export default () => {
  const usage = usually({
    usage: {
      source: `Location of the input to the transpiler,
either a directory or a file.`,
      '--output, -o': `Location to save results to. Passing "-"
will print to stdout when source is a file.`,
      '--help, -h': 'Display help information.',
      '--version, -v': 'Show version.',
      '--ignore, -i': `Paths to files to ignore, relative to the
source directory.`,
      '--noSourceMaps, -s': 'Don\'t generate source maps.',
      '--advanced, -a': `Attempt to skip statements inside of template
literals.`,
    },
    description: 'A tool to transpile JavaScript packages using regular expressions.',
    line: 'alamode source [-o destination]',
    example: 'alamode src -o build',
  })
  return usage
}
123
123
export async function example () {}

const example2 = () => {}

export default class Example {
  constructor() {
    example()
  }
}

export { example2 as alias }
123
       async function example () {}

const example2 = () => {}

               class Example {
  constructor() {
    example()
  }
}



module.exports = Example
module.exports.example = example
module.exports.alias = example2
```
  </td>
 </tr>
</tbody>
</table>

There are some [limitations](https://github.com/a-la/export#limitations) one should be aware about, however they will not typically cause problems for a Node.JS package. The line and column numbers are preserved for easier generation of the source maps, however this is likely to change in the future.


### Advanced Mode

Advanced mode is required when there are template strings inside of which `import` and `export` statements are found. To prevent them from participating in the transforms, `alamode` will cut them out first to stop transform regexes detecting statements inside of template literals, and then paste them back.

```js
import helloWorld from 'hello-world'

export const test = () => {
  const res = helloWorld()
  console.log(res)
}

export { test2 } from 'test'

const i = `
  import helloWorld from 'hello-world'
`
const e = `
  export { test } from 'test'
`
```

Without the advanced mode:

```js
123
#!/usr/bin/env node
import argufy from 'argufy'
import { version } from '../../package.json'
import catcher from './catcher'
import { transpile } from './transpile'
import getUsage from './usage'

const {
  input: _input,
  output: _output,
  version: _version,
  help: _help,
  ignore: _ignore,
  noSourceMaps: _noSourceMaps,
  advanced: _advanced,
} = argufy({
  input: { command: true },
  output: { short: 'o' },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
  ignore: { short: 'i' },
  noSourceMaps: { short: 's', boolean: true },
  advanced: { short: 'a', boolean: true },
})

if (_help) {
  const usage = getUsage()
  console.log(usage)
  process.exit()
} else if (_version) {
  console.log('v%s', version)
  process.exit()
}

(async () => {
  try {
    const ignore = _ignore ? _ignore.split(','): []
    await transpile({
      input: _input,
      output: _output,
      noSourceMaps: _noSourceMaps,
      ignore,
      advanced: _advanced,
    })
  } catch (err) {
    catcher(err)
  }
})()
123
123
import { debuglog } from 'util'

const LOG = debuglog('alamode')
const DEBUG = /alamode/.test(process.env.NODE_DEBUG)

const catcher = (err) => {
  let stack
  let message
  if (err instanceof Error) {
    ({ stack, message } = err)
  } else {
    stack = message = err
  }
  DEBUG ? LOG(stack) : console.log(message)
  process.exit(1)
}

export default catcher
123
123
import { join, basename, dirname } from 'path'
import { lstatSync } from 'fs'
import readDirStructure from '@wrote/read-dir-structure'
import ensurePath from '@wrote/ensure-path'
import { debuglog } from 'util'
import { copyMode } from '../lib'
import writeSourceMap from '../lib/source-map'
import { transformStream } from '../lib/transform'

const LOG = debuglog('alamode')

const processFile = async ({
  input, relPath, name, output, ignore, noSourceMaps, advanced,
}) => {
  const file = join(relPath, name)
  if (ignore.includes(file)) return

  const isOutputStdout = output == '-'
  const source = join(input, file)

  const outputDir = isOutputStdout ? null : join(output, relPath)
  const destination = isOutputStdout ? '-' : join(outputDir, name)
  LOG(file)

  await ensurePath(destination)

  const originalSource = await transformStream({
    source,
    destination,
    advanced,
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
  advanced,
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
      })
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir({
        input,
        output,
        ignore,
        relPath: newRelPath,
        noSourceMaps,
        advanced,
      })
    }
  }, Promise.resolve())
}

export const transpile = async ({
  input,
  output = '-',
  ignore = [],
  noSourceMaps,
  advanced,
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
      advanced,
    })
  } else if (ls.isFile()) {
    await processFile({
      input: dirname(input),
      relPath: '.',
      name: basename(input),
      output,
      ignore,
      noSourceMaps,
      advanced,
    })
  }
  if (output != '-') process.stdout.write(`Transpiled code saved to ${output}\n`)
}

123
123
import { chmodSync, lstatSync } from 'fs'

export const copyMode = (input, output) => {
  const ls = lstatSync(input)
  const { mode } = ls
  chmodSync(output, mode)
}
123
123
import { relative, join } from 'path'
import { appendFileSync, writeFileSync } from 'fs'
import { SourceMapGenerator } from 'source-map'
import { inlineCommentsRe, commentsRe } from '@a-la/markers/build/lib'

export const getMap = ({
  file,
  originalSource,
  pathToSrc,
  sourceRoot,
}) => {
  const gen = new SourceMapGenerator({
    file,
    sourceRoot,
  })
  const linesInSource = originalSource
    .replace(commentsRe, (match, pos) => {
      const next = originalSource[pos + match.length]
      if (next == '\n') return '\n'.repeat(match.split('\n').length - 1)

      const lines = match.split('\n')
      const lastLineI = lines.length - 1
      const lastLine = lines[lastLineI]
      const ss = ' '.repeat(lastLine.length)
      const ws = '\n'.repeat(lastLineI)
      return `${ws}${ss}`
    })
    .replace(inlineCommentsRe, (match) => {
      return ' '.repeat(match.length)
    })
    .split('\n')
  linesInSource.forEach((l, i) => {
    const line = i + 1
    l
      .replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (match, column) => {
        if (column == 0 && /^\s+$/.test(match)) return
        const pp = {
          line,
          column,
        }
        const m = {
          generated: pp,
          source: pathToSrc,
          original: pp,
        }
        gen.addMapping(m)
      })
  })
  gen.setSourceContent(pathToSrc, originalSource)
  const sourceMap = gen.toString()
  return sourceMap
}

export default function addSourceMap({
  source, outputDir, name, destination, file, originalSource,
}) {
  const pathToSrc = relative(outputDir, source)

  const map = getMap({
    file, originalSource, pathToSrc,
  })

  const sourceMapName = `${name}.map`
  const comment = `\n%%_RESTREAM_INLINECOMMENTS_REPLACEMENT_0_%%
  appendFileSync(destination, comment)

  const sourceMapPath = join(outputDir, sourceMapName)
  writeFileSync(sourceMapPath, map)
}
123
123
import { Replaceable } from 'restream'
import makeRules, { makeAdvancedRules } from '@a-la/markers'
import ALaImport, { advancedSeq as advancedALaImport } from '@a-la/import'
import ALaExport, { advancedSeq as advancedALaExport } from '@a-la/export'
import whichStream from 'which-stream'
import Catchment from 'catchment'
import { createReadStream } from 'fs'
import { basename, dirname, join } from 'path'
import { getMap } from './source-map'

const getConfig = () => {
  let config = {}
  try {
    const r = join(process.cwd(), '.alamoderc.json')
    config = require(r)
  } catch (err) {
    return config
  }
  const { env: { ALAMODE_ENV } } = process
  const c = config.env && ALAMODE_ENV in config.env ? config.env[ALAMODE_ENV] : config

  delete c.env

  return c
}

const getRules = (advanced) => {
  const r = advanced ? [
    ...advancedALaImport,
    ...advancedALaExport,
  ] : [
    ...ALaImport,
    ...ALaExport,
  ]
  const mr = advanced ? makeAdvancedRules : makeRules
  const { rules, markers } = mr(r)
  return { rules, markers }
}

const makeReplaceable = (advanced) => {
  const config = getConfig()
  const { rules, markers } = getRules(config.advanced || advanced)

  const replaceable = new Replaceable(rules)
  replaceable.markers = markers

  replaceable.config = config
  return replaceable
}

%%_RESTREAM_COMMENTS_REPLACEMENT_0_%%
export const transformStream = async ({
  source,
  destination,
  writable,
  advanced = false,
}) => {
  const replaceable = makeReplaceable(advanced)

  const readable = createReadStream(source)

  readable.pipe(replaceable)
  const { promise: sourcePromise } = new Catchment({ rs: readable })

  const [,, sourceCode] = await Promise.all([
    whichStream({
      source,
      ...(writable ? { writable } : { destination }),
      readable: replaceable,
    }),
    new Promise((r, j) => {
      replaceable.once('error', j)
      replaceable.once('end', r)
    }),
    sourcePromise,
  ])

  return sourceCode
}

class Context {
  constructor(config, markers) {
    this.listeners = {}
    this.markers = markers
    this.config = config
  }
  on(event, listener) {
    this.listeners[event] = listener
  }
  emit(event, data) {
    this.listeners[event](data)
  }
  get advanced() {
    return this.config.advanced
  }
}

export const transformString = (source, advanced) => {
  const config = getConfig()
  const { rules, markers } = getRules(config.advanced || advanced)
  const context = new Context(config, markers)

  const replaced = rules.reduce((acc, { re, replacement }) => {
    const newAcc = acc.replace(re, replacement.bind(context))
    return newAcc
  }, source)
  return replaced
}

%%_RESTREAM_COMMENTS_REPLACEMENT_1_%%
export const syncTransform = (source, filename, advanced) => {
  const replaced = transformString(source, advanced)
  const file = basename(filename)
  const sourceRoot = dirname(filename)
  const map = getMap({
    originalSource: source,
    pathToSrc: file,
    sourceRoot,
  })
  const b64 = Buffer.from(map).toString('base64')
  const s = `%%_RESTREAM_INLINECOMMENTS_REPLACEMENT_0_%%

  const code = `${replaced}\n${s}`

  return code
}
123
123
import usually from 'usually'

export default () => {
  const usage = usually({
    usage: {
      source: `Location of the input to the transpiler,
either a directory or a file.`,
      '--output, -o': `Location to save results to. Passing "-"
will print to stdout when source is a file.`,
      '--help, -h': 'Display help information.',
      '--version, -v': 'Show version.',
      '--ignore, -i': `Paths to files to ignore, relative to the
source directory.`,
      '--noSourceMaps, -s': 'Don\'t generate source maps.',
      '--advanced, -a': `Attempt to skip statements inside of template
literals.`,
    },
    description: 'A tool to transpile JavaScript packages using regular expressions.',
    line: 'alamode source [-o destination]',
    example: 'alamode src -o build',
  })
  return usage
}
123
123
import helloWorld from 'hello-world'

export const test = () => {
  const res = helloWorld()
  console.log(res)
}

export { test2 } from 'test'

const i = `
  import helloWorld from 'hello-world'
`
const e = `
  export { test } from 'test'
`
123
let helloWorld = require('hello-world'); if (helloWorld && helloWorld.__esModule) helloWorld = helloWorld.default;

       const test = () => {
  const res = helloWorld()
  console.log(res)
}

const $test = require('test');

const i = `
let helloWorld = require('hello-world'); if (helloWorld && helloWorld.__esModule) helloWorld = helloWorld.default;
`
const e = `
const $test = require('test');
`

module.exports.test = $test.test
module.exports.test2 = $test.test2
```

With the advanced mode:

```js
123
#!/usr/bin/env node
import argufy from 'argufy'
import { version } from '../../package.json'
import catcher from './catcher'
import { transpile } from './transpile'
import getUsage from './usage'

const {
  input: _input,
  output: _output,
  version: _version,
  help: _help,
  ignore: _ignore,
  noSourceMaps: _noSourceMaps,
  advanced: _advanced,
} = argufy({
  input: { command: true },
  output: { short: 'o' },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
  ignore: { short: 'i' },
  noSourceMaps: { short: 's', boolean: true },
  advanced: { short: 'a', boolean: true },
})

if (_help) {
  const usage = getUsage()
  console.log(usage)
  process.exit()
} else if (_version) {
  console.log('v%s', version)
  process.exit()
}

(async () => {
  try {
    const ignore = _ignore ? _ignore.split(','): []
    await transpile({
      input: _input,
      output: _output,
      noSourceMaps: _noSourceMaps,
      ignore,
      advanced: _advanced,
    })
  } catch (err) {
    catcher(err)
  }
})()
123
123
import { debuglog } from 'util'

const LOG = debuglog('alamode')
const DEBUG = /alamode/.test(process.env.NODE_DEBUG)

const catcher = (err) => {
  let stack
  let message
  if (err instanceof Error) {
    ({ stack, message } = err)
  } else {
    stack = message = err
  }
  DEBUG ? LOG(stack) : console.log(message)
  process.exit(1)
}

export default catcher
123
123
import { join, basename, dirname } from 'path'
import { lstatSync } from 'fs'
import readDirStructure from '@wrote/read-dir-structure'
import ensurePath from '@wrote/ensure-path'
import { debuglog } from 'util'
import { copyMode } from '../lib'
import writeSourceMap from '../lib/source-map'
import { transformStream } from '../lib/transform'

const LOG = debuglog('alamode')

const processFile = async ({
  input, relPath, name, output, ignore, noSourceMaps, advanced,
}) => {
  const file = join(relPath, name)
  if (ignore.includes(file)) return

  const isOutputStdout = output == '-'
  const source = join(input, file)

  const outputDir = isOutputStdout ? null : join(output, relPath)
  const destination = isOutputStdout ? '-' : join(outputDir, name)
  LOG(file)

  await ensurePath(destination)

  const originalSource = await transformStream({
    source,
    destination,
    advanced,
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
  advanced,
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
      })
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir({
        input,
        output,
        ignore,
        relPath: newRelPath,
        noSourceMaps,
        advanced,
      })
    }
  }, Promise.resolve())
}

export const transpile = async ({
  input,
  output = '-',
  ignore = [],
  noSourceMaps,
  advanced,
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
      advanced,
    })
  } else if (ls.isFile()) {
    await processFile({
      input: dirname(input),
      relPath: '.',
      name: basename(input),
      output,
      ignore,
      noSourceMaps,
      advanced,
    })
  }
  if (output != '-') process.stdout.write(`Transpiled code saved to ${output}\n`)
}

123
123
import { chmodSync, lstatSync } from 'fs'

export const copyMode = (input, output) => {
  const ls = lstatSync(input)
  const { mode } = ls
  chmodSync(output, mode)
}
123
123
import { relative, join } from 'path'
import { appendFileSync, writeFileSync } from 'fs'
import { SourceMapGenerator } from 'source-map'
import { inlineCommentsRe, commentsRe } from '@a-la/markers/build/lib'

export const getMap = ({
  file,
  originalSource,
  pathToSrc,
  sourceRoot,
}) => {
  const gen = new SourceMapGenerator({
    file,
    sourceRoot,
  })
  const linesInSource = originalSource
    .replace(commentsRe, (match, pos) => {
      const next = originalSource[pos + match.length]
      if (next == '\n') return '\n'.repeat(match.split('\n').length - 1)

      const lines = match.split('\n')
      const lastLineI = lines.length - 1
      const lastLine = lines[lastLineI]
      const ss = ' '.repeat(lastLine.length)
      const ws = '\n'.repeat(lastLineI)
      return `${ws}${ss}`
    })
    .replace(inlineCommentsRe, (match) => {
      return ' '.repeat(match.length)
    })
    .split('\n')
  linesInSource.forEach((l, i) => {
    const line = i + 1
    l
      .replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (match, column) => {
        if (column == 0 && /^\s+$/.test(match)) return
        const pp = {
          line,
          column,
        }
        const m = {
          generated: pp,
          source: pathToSrc,
          original: pp,
        }
        gen.addMapping(m)
      })
  })
  gen.setSourceContent(pathToSrc, originalSource)
  const sourceMap = gen.toString()
  return sourceMap
}

export default function addSourceMap({
  source, outputDir, name, destination, file, originalSource,
}) {
  const pathToSrc = relative(outputDir, source)

  const map = getMap({
    file, originalSource, pathToSrc,
  })

  const sourceMapName = `${name}.map`
  const comment = `\n%%_RESTREAM_INLINECOMMENTS_REPLACEMENT_0_%%
  appendFileSync(destination, comment)

  const sourceMapPath = join(outputDir, sourceMapName)
  writeFileSync(sourceMapPath, map)
}
123
123
import { Replaceable } from 'restream'
import makeRules, { makeAdvancedRules } from '@a-la/markers'
import ALaImport, { advancedSeq as advancedALaImport } from '@a-la/import'
import ALaExport, { advancedSeq as advancedALaExport } from '@a-la/export'
import whichStream from 'which-stream'
import Catchment from 'catchment'
import { createReadStream } from 'fs'
import { basename, dirname, join } from 'path'
import { getMap } from './source-map'

const getConfig = () => {
  let config = {}
  try {
    const r = join(process.cwd(), '.alamoderc.json')
    config = require(r)
  } catch (err) {
    return config
  }
  const { env: { ALAMODE_ENV } } = process
  const c = config.env && ALAMODE_ENV in config.env ? config.env[ALAMODE_ENV] : config

  delete c.env

  return c
}

const getRules = (advanced) => {
  const r = advanced ? [
    ...advancedALaImport,
    ...advancedALaExport,
  ] : [
    ...ALaImport,
    ...ALaExport,
  ]
  const mr = advanced ? makeAdvancedRules : makeRules
  const { rules, markers } = mr(r)
  return { rules, markers }
}

const makeReplaceable = (advanced) => {
  const config = getConfig()
  const { rules, markers } = getRules(config.advanced || advanced)

  const replaceable = new Replaceable(rules)
  replaceable.markers = markers

  replaceable.config = config
  return replaceable
}

%%_RESTREAM_COMMENTS_REPLACEMENT_0_%%
export const transformStream = async ({
  source,
  destination,
  writable,
  advanced = false,
}) => {
  const replaceable = makeReplaceable(advanced)

  const readable = createReadStream(source)

  readable.pipe(replaceable)
  const { promise: sourcePromise } = new Catchment({ rs: readable })

  const [,, sourceCode] = await Promise.all([
    whichStream({
      source,
      ...(writable ? { writable } : { destination }),
      readable: replaceable,
    }),
    new Promise((r, j) => {
      replaceable.once('error', j)
      replaceable.once('end', r)
    }),
    sourcePromise,
  ])

  return sourceCode
}

class Context {
  constructor(config, markers) {
    this.listeners = {}
    this.markers = markers
    this.config = config
  }
  on(event, listener) {
    this.listeners[event] = listener
  }
  emit(event, data) {
    this.listeners[event](data)
  }
  get advanced() {
    return this.config.advanced
  }
}

export const transformString = (source, advanced) => {
  const config = getConfig()
  const { rules, markers } = getRules(config.advanced || advanced)
  const context = new Context(config, markers)

  const replaced = rules.reduce((acc, { re, replacement }) => {
    const newAcc = acc.replace(re, replacement.bind(context))
    return newAcc
  }, source)
  return replaced
}

%%_RESTREAM_COMMENTS_REPLACEMENT_1_%%
export const syncTransform = (source, filename, advanced) => {
  const replaced = transformString(source, advanced)
  const file = basename(filename)
  const sourceRoot = dirname(filename)
  const map = getMap({
    originalSource: source,
    pathToSrc: file,
    sourceRoot,
  })
  const b64 = Buffer.from(map).toString('base64')
  const s = `%%_RESTREAM_INLINECOMMENTS_REPLACEMENT_0_%%

  const code = `${replaced}\n${s}`

  return code
}
123
123
import usually from 'usually'

export default () => {
  const usage = usually({
    usage: {
      source: `Location of the input to the transpiler,
either a directory or a file.`,
      '--output, -o': `Location to save results to. Passing "-"
will print to stdout when source is a file.`,
      '--help, -h': 'Display help information.',
      '--version, -v': 'Show version.',
      '--ignore, -i': `Paths to files to ignore, relative to the
source directory.`,
      '--noSourceMaps, -s': 'Don\'t generate source maps.',
      '--advanced, -a': `Attempt to skip statements inside of template
literals.`,
    },
    description: 'A tool to transpile JavaScript packages using regular expressions.',
    line: 'alamode source [-o destination]',
    example: 'alamode src -o build',
  })
  return usage
}
123
let helloWorld = require('hello-world'); if (helloWorld && helloWorld.__esModule) helloWorld = helloWorld.default;

       const test = () => {
  const res = helloWorld()
  console.log(res)
}

const $test = require('test');

const i = `
  import helloWorld from 'hello-world'
`
const e = `
  export { test } from 'test'
`

module.exports.test = test
module.exports.test2 = $test.test2
```

However, this option is not perfect, and



If it was the other way around (with template literals being detected first), e.g.,

```js
const bool = false
const url = 'test'
/* A path to an example ` */
const t = 'https://example.com'
export const t
/* A path to the test ` */
const t2 = 'https://test.org'
```

there still would be a problem, as the same logic would apply to stripping everything between 2 \`s. This shows that `alamode` is not very robust because it does not build an AST, and can work for many simpler cases. Most of the time, there would be no need to write `export` and `import` statements in the template literals where they receive a dedicated line.
## Modes

Any block comments are stripped by default, to prevent issues such as detecting `import` and `export` statements inside of examples, e.g.,

```js
/**
 * Use this method to show an example usage.
 * @example
 *
 * import { example } from './example'
 *
 * example()
 */
export const example = () => console.log('example')
```

However, this might backfire and prevent the program from being transpiled correctly when block comments are incorrectly deduced, e.g.,

```js
const t = `https://example.com/*`
export default t
const t2 = `https://example.com/*/test`
export { t2 }
```

The above will not work because `/* */` is used to strip out comments before detecting template literals, and in the example it is included in 2 distinct template literals, so that the code with the `export` statement in-between is temporarily removed and does not participate in transforms.

##
## Require Hook

The purpose of the require hook is to be able to run transpile files automatically when they are imported.

To use this feature, `alamode` needs to be `required` in a separate file, after which `import` and `export` statements will become available.

For example, take the following directory structure, with a main and library files:

```m
example/require
├── index.js
├── lib.js
└── require.js
```

<table>
<thead>
<tr>
<th><code>index.js</code></th>
<th><code>lib.js</code></th>
</tr>
</thead>
<tbody>
<tr/><tr>
<td>

```js
import getInfo from './lib'

console.log(getInfo())
```
</td>
<td>

```js
import { platform, arch } from 'os'

export default () => {
  return `${platform()}:${arch()}`
}
```
</td>
</tr>
</tbody>
</table>


The require hook would work in the following way:

```js
require('alamode')()
require('.')
```

By executing the `node require.js` command, `alamode` will be installed and it will do its job dynamically for every `.js` file that is required, enabling to use `import` and `export` statements.

```
123
import getInfo from './lib'

console.log(getInfo())
123
123
import { platform, arch } from 'os'

export default () => {
  return `${platform()}:${arch()}`
}
123
darwin:x64
```


## Source Maps

The source maps are supported by this package, but implemented in a hack-ish way. The transforms will aim to preserve line and column numbers, so that no additional remapping is required. However this is not enough to generate a source map good enough for a debugger -- it needs to know about mappings of positions between segments which can be operators, function calls, _etc_. `alamode` simply breaks the source code into distinct chunks such as white-spaces, identifiers and comments, and down into individual symbols. Using this method, the size of a source map is larger, but it still works. In further versions, this will be improved to allow to extract real segments.

[![source map visualistion](doc/sourcemap.gif)](http://sokra.github.io/source-map-visualization/#base64,Y29uc3QgeyBqb2luLCBiYXNlbmFtZSwgZGlybmFtZSB9ID0gcmVxdWlyZSgncGF0aCcpCmNvbnN0IHsgbHN0YXRTeW5jIH0gPSByZXF1aXJlKCdmcycpCmxldCByZWFkRGlyU3RydWN0dXJlID0gcmVxdWlyZSgnQHdyb3RlL3JlYWQtZGlyLXN0cnVjdHVyZScpOyBpZiAocmVhZERpclN0cnVjdHVyZSAmJiByZWFkRGlyU3RydWN0dXJlLl9fZXNNb2R1bGUpIHJlYWREaXJTdHJ1Y3R1cmUgPSByZWFkRGlyU3RydWN0dXJlLmRlZmF1bHQ7CmxldCBlbnN1cmVQYXRoID0gcmVxdWlyZSgnQHdyb3RlL2Vuc3VyZS1wYXRoJyk7IGlmIChlbnN1cmVQYXRoICYmIGVuc3VyZVBhdGguX19lc01vZHVsZSkgZW5zdXJlUGF0aCA9IGVuc3VyZVBhdGguZGVmYXVsdDsKY29uc3QgeyBkZWJ1Z2xvZyB9ID0gcmVxdWlyZSgndXRpbCcpCmNvbnN0IHsgY29weU1vZGUgfSA9IHJlcXVpcmUoJy4uL2xpYicpCmxldCB3cml0ZVNvdXJjZU1hcCA9IHJlcXVpcmUoJy4uL2xpYi9zb3VyY2UtbWFwJyk7IGlmICh3cml0ZVNvdXJjZU1hcCAmJiB3cml0ZVNvdXJjZU1hcC5fX2VzTW9kdWxlKSB3cml0ZVNvdXJjZU1hcCA9IHdyaXRlU291cmNlTWFwLmRlZmF1bHQ7CmNvbnN0IHsgdHJhbnNmb3JtU3RyZWFtIH0gPSByZXF1aXJlKCcuLi9saWIvdHJhbnNmb3JtJykKCmNvbnN0IExPRyA9IGRlYnVnbG9nKCdhbGFtb2RlJykKCmNvbnN0IHByb2Nlc3NGaWxlID0gYXN5bmMgKHsKICBpbnB1dCwgcmVsUGF0aCwgbmFtZSwgb3V0cHV0LCBpZ25vcmUsIG5vU291cmNlTWFwcywKfSkgPT4gewogIGNvbnN0IGZpbGUgPSBqb2luKHJlbFBhdGgsIG5hbWUpCiAgaWYgKGlnbm9yZS5pbmNsdWRlcyhmaWxlKSkgcmV0dXJuCgogIGNvbnN0IGlzT3V0cHV0U3Rkb3V0ID0gb3V0cHV0ID09ICctJwogIGNvbnN0IHNvdXJjZSA9IGpvaW4oaW5wdXQsIGZpbGUpCgogIGNvbnN0IG91dHB1dERpciA9IGlzT3V0cHV0U3Rkb3V0ID8gbnVsbCA6IGpvaW4ob3V0cHV0LCByZWxQYXRoKQogIGNvbnN0IGRlc3RpbmF0aW9uID0gaXNPdXRwdXRTdGRvdXQgPyAnLScgOiBqb2luKG91dHB1dERpciwgbmFtZSkKICBMT0coZmlsZSkKCiAgYXdhaXQgZW5zdXJlUGF0aChkZXN0aW5hdGlvbikKCiAgY29uc3Qgb3JpZ2luYWxTb3VyY2UgPSBhd2FpdCB0cmFuc2Zvcm1TdHJlYW0oewogICAgc291cmNlLAogICAgZGVzdGluYXRpb24sCiAgfSkKCiAgaWYgKG91dHB1dCAhPSAnLScpIHsKICAgIGNvcHlNb2RlKHNvdXJjZSwgZGVzdGluYXRpb24pCiAgICBpZiAobm9Tb3VyY2VNYXBzKSByZXR1cm4KICAgIHdyaXRlU291cmNlTWFwKHsKICAgICAgZGVzdGluYXRpb24sCiAgICAgIGZpbGUsCiAgICAgIG5hbWUsCiAgICAgIG91dHB1dERpciwKICAgICAgc291cmNlLAogICAgICBvcmlnaW5hbFNvdXJjZSwKICAgIH0pCiAgfQp9Cgpjb25zdCBwcm9jZXNzRGlyID0gYXN5bmMgKHsKICBpbnB1dCwKICBvdXRwdXQsCiAgcmVsUGF0aCA9ICcuJywKICBpZ25vcmUgPSBbXSwKICBub1NvdXJjZU1hcHMsCn0pID0+IHsKICBjb25zdCBwYXRoID0gam9pbihpbnB1dCwgcmVsUGF0aCkKICBjb25zdCB7IGNvbnRlbnQgfSA9IGF3YWl0IHJlYWREaXJTdHJ1Y3R1cmUocGF0aCkKICBjb25zdCBrID0gT2JqZWN0LmtleXMoY29udGVudCkKICBhd2FpdCBrLnJlZHVjZShhc3luYyAoYWNjLCBuYW1lKSA9PiB7CiAgICBhd2FpdCBhY2MKICAgIGNvbnN0IHsgdHlwZSB9ID0gY29udGVudFtuYW1lXQogICAgaWYgKHR5cGUgPT0gJ0ZpbGUnKSB7CiAgICAgIGF3YWl0IHByb2Nlc3NGaWxlKHsKICAgICAgICBpbnB1dCwgcmVsUGF0aCwgbmFtZSwgb3V0cHV0LCBpZ25vcmUsIG5vU291cmNlTWFwcywKICAgICAgfSkKICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnRGlyZWN0b3J5JykgewogICAgICBjb25zdCBuZXdSZWxQYXRoID0gam9pbihyZWxQYXRoLCBuYW1lKQogICAgICBhd2FpdCBwcm9jZXNzRGlyKHsKICAgICAgICBpbnB1dCwKICAgICAgICBvdXRwdXQsCiAgICAgICAgaWdub3JlLAogICAgICAgIHJlbFBhdGg6IG5ld1JlbFBhdGgsCiAgICAgICAgbm9Tb3VyY2VNYXBzLAogICAgICB9KQogICAgfQogIH0sIFByb21pc2UucmVzb2x2ZSgpKQp9CgogICAgICAgY29uc3QgdHJhbnNwaWxlID0gYXN5bmMgKHsKICBpbnB1dCwKICBvdXRwdXQgPSAnLScsCiAgaWdub3JlID0gW10sCiAgbm9Tb3VyY2VNYXBzLAp9KSA9PiB7CiAgaWYgKCFpbnB1dCkgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2Ugc3BlY2lmeSB0aGUgc291cmNlIGZpbGUgb3IgZGlyZWN0b3J5LicpCgogIGNvbnN0IGxzID0gbHN0YXRTeW5jKGlucHV0KQogIGlmIChscy5pc0RpcmVjdG9yeSgpKSB7CiAgICBpZiAoIW91dHB1dCkgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2Ugc3BlY2lmeSB0aGUgb3V0cHV0IGRpcmVjdG9yeS4nKQogICAgYXdhaXQgcHJvY2Vzc0Rpcih7CiAgICAgIGlucHV0LAogICAgICBvdXRwdXQsCiAgICAgIGlnbm9yZSwKICAgICAgbm9Tb3VyY2VNYXBzLAogICAgfSkKICB9IGVsc2UgaWYgKGxzLmlzRmlsZSgpKSB7CiAgICBhd2FpdCBwcm9jZXNzRmlsZSh7CiAgICAgIGlucHV0OiBkaXJuYW1lKGlucHV0KSwKICAgICAgcmVsUGF0aDogJy4nLAogICAgICBuYW1lOiBiYXNlbmFtZShpbnB1dCksCiAgICAgIG91dHB1dCwKICAgICAgaWdub3JlLAogICAgICBub1NvdXJjZU1hcHMsCiAgICB9KQogIH0KICBpZiAob3V0cHV0ICE9ICctJykgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYFRyYW5zcGlsZWQgY29kZSBzYXZlZCB0byAke291dHB1dH1cbmApCn0KCgptb2R1bGUuZXhwb3J0cy50cmFuc3BpbGUgPSB0cmFuc3BpbGUKLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNwaWxlLmpzLm1hcA==,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vdHJhbnNwaWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJO0FBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQzdCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVM7QUFDdkQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSTtBQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSTtBQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRztBQUNoQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRztBQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVM7O0FBRWpELEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7QUFFOUIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDekIsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFD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QyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLEtBQUssQ0FBQyxXQUFXLENBQUM7TUFDaEIsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztNQUNyQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNaLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7TUFDckIsTUFBTTtNQUNOLE1BQU07TUFDTixZQUFZO0lBQ2QsQ0FBQztFQUNIO0VBQ0EsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hGIiwiZmlsZSI6ImJpbi90cmFuc3BpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luLCBiYXNlbmFtZSwgZGlybmFtZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBsc3RhdFN5bmMgfSBmcm9tICdmcydcbmltcG9ydCByZWFkRGlyU3RydWN0dXJlIGZyb20gJ0B3cm90ZS9yZWFkLWRpci1zdHJ1Y3R1cmUnXG5pbXBvcnQgZW5zdXJlUGF0aCBmcm9tICdAd3JvdGUvZW5zdXJlLXBhdGgnXG5pbXBvcnQgeyBkZWJ1Z2xvZyB9IGZyb20gJ3V0aWwnXG5pbXBvcnQgeyBjb3B5TW9kZSB9IGZyb20gJy4uL2xpYidcbmltcG9ydCB3cml0ZVNvdXJjZU1hcCBmcm9tICcuLi9saWIvc291cmNlLW1hcCdcbmltcG9ydCB7IHRyYW5zZm9ybVN0cmVhbSB9IGZyb20gJy4uL2xpYi90cmFuc2Zvcm0nXG5cbmNvbnN0IExPRyA9IGRlYnVnbG9nKCdhbGFtb2RlJylcblxuY29uc3QgcHJvY2Vzc0ZpbGUgPSBhc3luYyAoe1xuICBpbnB1dCwgcmVsUGF0aCwgbmFtZSwgb3V0cHV0LCBpZ25vcmUsIG5vU291cmNlTWFwcyxcbn0pID0+IHtcbiAgY29uc3QgZmlsZSA9IGpvaW4ocmVsUGF0aCwgbmFtZSlcbiAgaWYgKGlnbm9yZS5pbmNsdWRlcyhmaWxlKSkgcmV0dXJuXG5cbiAgY29uc3QgaXNPdXRwdXRTdGRvdXQgPSBvdXRwdXQgPT0gJy0nXG4gIGNvbnN0IHNvdXJjZSA9IGpvaW4oaW5wdXQsIGZpbGUpXG5cbiAgY29uc3Qgb3V0cHV0RGlyID0gaXNPdXRwdXRTdGRvdXQgPyBudWxsIDogam9pbihvdXRwdXQsIHJlbFBhdGgpXG4gIGNvbnN0IGRlc3RpbmF0aW9uID0gaXNPdXRwdXRTdGRvdXQgPyAnLScgOiBqb2luKG91dHB1dERpciwgbmFtZSlcbiAgTE9HKGZpbGUpXG5cbiAgYXdhaXQgZW5zdXJlUGF0aChkZXN0aW5hdGlvbilcblxuICBjb25zdCBvcmlnaW5hbFNvdXJjZSA9IGF3YWl0IHRyYW5zZm9ybVN0cmVhbSh7XG4gICAgc291cmNlLFxuICAgIGRlc3RpbmF0aW9uLFxuICB9KVxuXG4gIGlmIChvdXRwdXQgIT0gJy0nKSB7XG4gICAgY29weU1vZGUoc291cmNlLCBkZXN0aW5hdGlvbilcbiAgICBpZiAobm9Tb3VyY2VNYXBzKSByZXR1cm5cbiAgICB3cml0ZVNvdXJjZU1hcCh7XG4gICAgICBkZXN0aW5hdGlvbixcbiAgICAgIGZpbGUsXG4gICAgICBuYW1lLFxuICAgICAgb3V0cHV0RGlyLFxuICAgICAgc291cmNlLFxuICAgICAgb3JpZ2luYWxTb3VyY2UsXG4gICAgfSlcbiAgfVxufVxuXG5jb25zdCBwcm9jZXNzRGlyID0gYXN5bmMgKHtcbiAgaW5wdXQsXG4gIG91dHB1dCxcbiAgcmVsUGF0aCA9ICcuJyxcbiAgaWdub3JlID0gW10sXG4gIG5vU291cmNlTWFwcyxcbn0pID0+IHtcbiAgY29uc3QgcGF0aCA9IGpvaW4oaW5wdXQsIHJlbFBhdGgpXG4gIGNvbnN0IHsgY29udGVudCB9ID0gYXdhaXQgcmVhZERpclN0cnVjdHVyZShwYXRoKVxuICBjb25zdCBrID0gT2JqZWN0LmtleXMoY29udGVudClcbiAgYXdhaXQgay5yZWR1Y2UoYXN5bmMgKGFjYywgbmFtZSkgPT4ge1xuICAgIGF3YWl0IGFjY1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gY29udGVudFtuYW1lXVxuICAgIGlmICh0eXBlID09ICdGaWxlJykge1xuICAgICAgYXdhaXQgcHJvY2Vzc0ZpbGUoe1xuICAgICAgICBpbnB1dCwgcmVsUGF0aCwgbmFtZSwgb3V0cHV0LCBpZ25vcmUsIG5vU291cmNlTWFwcyxcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdEaXJlY3RvcnknKSB7XG4gICAgICBjb25zdCBuZXdSZWxQYXRoID0gam9pbihyZWxQYXRoLCBuYW1lKVxuICAgICAgYXdhaXQgcHJvY2Vzc0Rpcih7XG4gICAgICAgIGlucHV0LFxuICAgICAgICBvdXRwdXQsXG4gICAgICAgIGlnbm9yZSxcbiAgICAgICAgcmVsUGF0aDogbmV3UmVsUGF0aCxcbiAgICAgICAgbm9Tb3VyY2VNYXBzLFxuICAgICAgfSlcbiAgICB9XG4gIH0sIFByb21pc2UucmVzb2x2ZSgpKVxufVxuXG5leHBvcnQgY29uc3QgdHJhbnNwaWxlID0gYXN5bmMgKHtcbiAgaW5wdXQsXG4gIG91dHB1dCA9ICctJyxcbiAgaWdub3JlID0gW10sXG4gIG5vU291cmNlTWFwcyxcbn0pID0+IHtcbiAgaWYgKCFpbnB1dCkgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2Ugc3BlY2lmeSB0aGUgc291cmNlIGZpbGUgb3IgZGlyZWN0b3J5LicpXG5cbiAgY29uc3QgbHMgPSBsc3RhdFN5bmMoaW5wdXQpXG4gIGlmIChscy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgaWYgKCFvdXRwdXQpIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHNwZWNpZnkgdGhlIG91dHB1dCBkaXJlY3RvcnkuJylcbiAgICBhd2FpdCBwcm9jZXNzRGlyKHtcbiAgICAgIGlucHV0LFxuICAgICAgb3V0cHV0LFxuICAgICAgaWdub3JlLFxuICAgICAgbm9Tb3VyY2VNYXBzLFxuICAgIH0pXG4gIH0gZWxzZSBpZiAobHMuaXNGaWxlKCkpIHtcbiAgICBhd2FpdCBwcm9jZXNzRmlsZSh7XG4gICAgICBpbnB1dDogZGlybmFtZShpbnB1dCksXG4gICAgICByZWxQYXRoOiAnLicsXG4gICAgICBuYW1lOiBiYXNlbmFtZShpbnB1dCksXG4gICAgICBvdXRwdXQsXG4gICAgICBpZ25vcmUsXG4gICAgICBub1NvdXJjZU1hcHMsXG4gICAgfSlcbiAgfVxuICBpZiAob3V0cHV0ICE9ICctJykgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYFRyYW5zcGlsZWQgY29kZSBzYXZlZCB0byAke291dHB1dH1cXG5gKVxufVxuIl19,aW1wb3J0IHsgam9pbiwgYmFzZW5hbWUsIGRpcm5hbWUgfSBmcm9tICdwYXRoJwppbXBvcnQgeyBsc3RhdFN5bmMgfSBmcm9tICdmcycKaW1wb3J0IHJlYWREaXJTdHJ1Y3R1cmUgZnJvbSAnQHdyb3RlL3JlYWQtZGlyLXN0cnVjdHVyZScKaW1wb3J0IGVuc3VyZVBhdGggZnJvbSAnQHdyb3RlL2Vuc3VyZS1wYXRoJwppbXBvcnQgeyBkZWJ1Z2xvZyB9IGZyb20gJ3V0aWwnCmltcG9ydCB7IGNvcHlNb2RlIH0gZnJvbSAnLi4vbGliJwppbXBvcnQgd3JpdGVTb3VyY2VNYXAgZnJvbSAnLi4vbGliL3NvdXJjZS1tYXAnCmltcG9ydCB7IHRyYW5zZm9ybVN0cmVhbSB9IGZyb20gJy4uL2xpYi90cmFuc2Zvcm0nCgpjb25zdCBMT0cgPSBkZWJ1Z2xvZygnYWxhbW9kZScpCgpjb25zdCBwcm9jZXNzRmlsZSA9IGFzeW5jICh7CiAgaW5wdXQsIHJlbFBhdGgsIG5hbWUsIG91dHB1dCwgaWdub3JlLCBub1NvdXJjZU1hcHMsCn0pID0+IHsKICBjb25zdCBmaWxlID0gam9pbihyZWxQYXRoLCBuYW1lKQogIGlmIChpZ25vcmUuaW5jbHVkZXMoZmlsZSkpIHJldHVybgoKICBjb25zdCBpc091dHB1dFN0ZG91dCA9IG91dHB1dCA9PSAnLScKICBjb25zdCBzb3VyY2UgPSBqb2luKGlucHV0LCBmaWxlKQoKICBjb25zdCBvdXRwdXREaXIgPSBpc091dHB1dFN0ZG91dCA/IG51bGwgOiBqb2luKG91dHB1dCwgcmVsUGF0aCkKICBjb25zdCBkZXN0aW5hdGlvbiA9IGlzT3V0cHV0U3Rkb3V0ID8gJy0nIDogam9pbihvdXRwdXREaXIsIG5hbWUpCiAgTE9HKGZpbGUpCgogIGF3YWl0IGVuc3VyZVBhdGgoZGVzdGluYXRpb24pCgogIGNvbnN0IG9yaWdpbmFsU291cmNlID0gYXdhaXQgdHJhbnNmb3JtU3RyZWFtKHsKICAgIHNvdXJjZSwKICAgIGRlc3RpbmF0aW9uLAogIH0pCgogIGlmIChvdXRwdXQgIT0gJy0nKSB7CiAgICBjb3B5TW9kZShzb3VyY2UsIGRlc3RpbmF0aW9uKQogICAgaWYgKG5vU291cmNlTWFwcykgcmV0dXJuCiAgICB3cml0ZVNvdXJjZU1hcCh7CiAgICAgIGRlc3RpbmF0aW9uLAogICAgICBmaWxlLAogICAgICBuYW1lLAogICAgICBvdXRwdXREaXIsCiAgICAgIHNvdXJjZSwKICAgICAgb3JpZ2luYWxTb3VyY2UsCiAgICB9KQogIH0KfQoKY29uc3QgcHJvY2Vzc0RpciA9IGFzeW5jICh7CiAgaW5wdXQsCiAgb3V0cHV0LAogIHJlbFBhdGggPSAnLicsCiAgaWdub3JlID0gW10sCiAgbm9Tb3VyY2VNYXBzLAp9KSA9PiB7CiAgY29uc3QgcGF0aCA9IGpvaW4oaW5wdXQsIHJlbFBhdGgpCiAgY29uc3QgeyBjb250ZW50IH0gPSBhd2FpdCByZWFkRGlyU3RydWN0dXJlKHBhdGgpCiAgY29uc3QgayA9IE9iamVjdC5rZXlzKGNvbnRlbnQpCiAgYXdhaXQgay5yZWR1Y2UoYXN5bmMgKGFjYywgbmFtZSkgPT4gewogICAgYXdhaXQgYWNjCiAgICBjb25zdCB7IHR5cGUgfSA9IGNvbnRlbnRbbmFtZV0KICAgIGlmICh0eXBlID09ICdGaWxlJykgewogICAgICBhd2FpdCBwcm9jZXNzRmlsZSh7CiAgICAgICAgaW5wdXQsIHJlbFBhdGgsIG5hbWUsIG91dHB1dCwgaWdub3JlLCBub1NvdXJjZU1hcHMsCiAgICAgIH0pCiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ0RpcmVjdG9yeScpIHsKICAgICAgY29uc3QgbmV3UmVsUGF0aCA9IGpvaW4ocmVsUGF0aCwgbmFtZSkKICAgICAgYXdhaXQgcHJvY2Vzc0Rpcih7CiAgICAgICAgaW5wdXQsCiAgICAgICAgb3V0cHV0LAogICAgICAgIGlnbm9yZSwKICAgICAgICByZWxQYXRoOiBuZXdSZWxQYXRoLAogICAgICAgIG5vU291cmNlTWFwcywKICAgICAgfSkKICAgIH0KICB9LCBQcm9taXNlLnJlc29sdmUoKSkKfQoKZXhwb3J0IGNvbnN0IHRyYW5zcGlsZSA9IGFzeW5jICh7CiAgaW5wdXQsCiAgb3V0cHV0ID0gJy0nLAogIGlnbm9yZSA9IFtdLAogIG5vU291cmNlTWFwcywKfSkgPT4gewogIGlmICghaW5wdXQpIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHNwZWNpZnkgdGhlIHNvdXJjZSBmaWxlIG9yIGRpcmVjdG9yeS4nKQoKICBjb25zdCBscyA9IGxzdGF0U3luYyhpbnB1dCkKICBpZiAobHMuaXNEaXJlY3RvcnkoKSkgewogICAgaWYgKCFvdXRwdXQpIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHNwZWNpZnkgdGhlIG91dHB1dCBkaXJlY3RvcnkuJykKICAgIGF3YWl0IHByb2Nlc3NEaXIoewogICAgICBpbnB1dCwKICAgICAgb3V0cHV0LAogICAgICBpZ25vcmUsCiAgICAgIG5vU291cmNlTWFwcywKICAgIH0pCiAgfSBlbHNlIGlmIChscy5pc0ZpbGUoKSkgewogICAgYXdhaXQgcHJvY2Vzc0ZpbGUoewogICAgICBpbnB1dDogZGlybmFtZShpbnB1dCksCiAgICAgIHJlbFBhdGg6ICcuJywKICAgICAgbmFtZTogYmFzZW5hbWUoaW5wdXQpLAogICAgICBvdXRwdXQsCiAgICAgIGlnbm9yZSwKICAgICAgbm9Tb3VyY2VNYXBzLAogICAgfSkKICB9CiAgaWYgKG91dHB1dCAhPSAnLScpIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGBUcmFuc3BpbGVkIGNvZGUgc2F2ZWQgdG8gJHtvdXRwdXR9XG5gKQp9Cg==)

<details>
  <summary>Click to View: <a name="debug-session"><code>debug session</code></a></summary>
  <table>
  <tr><td>
    <img alt="Alt: Debugging a source code with source maps." src="doc/debugger1.gif" />
  </td></tr>
  </table>
</details>

## Troubleshooting

Because there can be many intricacies when transpiling with regular expressions, problems might arise from time to time. If using the `require` hook, the best solution is to build the source code using `alamode` binary, and see where the error occurs. Then it must be analysed why it happens, for example:

- The `import` or `export` transform does not match the case.
- A portion of source code is cut out before the transform with [`markers`](https://github.com/a-la/markers/blob/master/src/index.js#L46) so that the line does not participate in a transform.

## TODO

- [ ] Allow to erase the build directory before the build so that old files are removed.
- [ ] Implement JSX transform.

## Copyright

(c) [À La Mode][1] 2018

[1]: https://alamode.cc
