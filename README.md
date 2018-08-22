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
  * [`NODE_DEBUG`](#node_debug)
- [.alamoderc.json](#alamodercjson)
- [Transforms](#transforms)
  * [`@a-la/import`](#a-laimport)
    * [Replace Path](#replace-path)
  * [`@a-la/export`](#a-laexport)
- [Require Hook](#require-hook)
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
| <a name="ignore-paths">Ignore Paths</a> | `-i`, `--ignore` | A list of files inside of the source directory to ignore, separated with a comma. For example, to ignore `src/bin/register.js` when building `src`, the `-i bin/register.js` should be passed |
| <a name="no-source-maps">No Source Maps</a> | `-s`, `--noSourceMaps` | Don't generate source maps. |

Setting the <a name="node_debug">`NODE_DEBUG`</a> environmental variable to `alamode` will print the list of processed files to the `stderr`.

```sh
$ NODE_DEBUG=alamode alamode src -o build
```

```fs
ALAMODE 97955: index.js
ALAMODE 97955: bin/catcher.js
ALAMODE 97955: bin/index.js
ALAMODE 97955: bin/register.js
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
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
let restream = require('restream'); if (restream && restream.__esModule) restream = restream.default; const {
  Replaceable,
  makeMarkers, makeCutRule, makePasteRule,
} = restream
const { resolve, join } = require('path')
const { version } = require('../../package.json')
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
darwin:x64
```


## Copyright

(c) [À La Mode][1] 2018

[1]: https://alamode.cc
