# alamode

[![npm version](https://badge.fury.io/js/alamode.svg)](https://npmjs.org/package/alamode)

`alamode` is  a RegExp-based transpiler of source code in Node.js. It is a fast, low-weight alternative to AST-based transpilers, such as `@babel`.

```
yarn add -DE alamode
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Installation](#installation)
  * [Global](#global)
  * [Project](#project)
- [CLI](#cli)
  * [Output Location](#output-location)
  * [Watch Mode](#watch-mode)
  * [Show Help](#show-help)
  * [Show Version](#show-version)
- [Transforms](#transforms)
  * [`@a-la/import`](#a-laimport)
  * [`@a-la/export`](#a-laexport)
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
| <a name="show-version">Show Version</a> | `-v`, `--version` | Display version number and quit. |
## Transforms

There are a number of built-in transforms, which don't need to be installed separetely because their size is small enough to be included as direct dependencies.

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
let restream = require('restream'); if (restream && restream.__esModule) restream = restream.default;
const {
  Replaceable,
  makeMarkers, makeCutRule, makePasteRule,
} = restream
const { resolve, join } = require('path')
const { version } = require('../../package.json')
```

The `if (dependency && dependency.__esModule) dependency = dependency.default;` check is there to make `alamode` compatible with `babel`, which will export default modules in the `default` property of `module.exports` object and add the `__esModule` marker.

### `@a-la/export`

Transforms all `export` statements into `module.exports` statements.

```js
/**
 * Example 1: named export (const).
 */
export const example1 = async () => {
  console.log('named export 1')
}

/**
 * Example 2: named export (function).
 */
export function example2() {
  console.log('named export 2')
}

/**
 * Example 3: declare a function and export later.
 */
function example3() {
  console.log('named export 3')
}

/**
 * Example 4: declare an async function and export later with an alias.
 */
const example4 = async () => {
  console.log('named export 4')
}

export { example3, example4 as alias4 }

/**
 * Default Class Example.
 */
export default class Example {
  /**
   * A constructor for the example.
   * @constructor
   */
  constructor() {
    console.log('default export')
  }
}
```

```js
/**
 * Example 1: named export (const).
 */
const example1 = async () => {
  console.log('named export 1')
}

/**
 * Example 2: named export (function).
 */
function example2() {
  console.log('named export 2')
}

/**
 * Example 3: declare a function and export later.
 */
function example3() {
  console.log('named export 3')
}

/**
 * Example 4: declare an async function and export later with an alias.
 */
const example4 = async () => {
  console.log('named export 4')
}


/**
 * Default Class Example.
 */
class Example {
  /**
   * A constructor for the example.
   * @constructor
   */
  constructor() {
    console.log('default export')
  }
}

module.exports = Example
module.exports.example1 = example1
module.exports.example2 = example2
module.exports.example3 = example3
module.exports.alias4 = example4
```

There are some [limitations](https://github.com/a-la/export#limitations) one should be aware about, however they will not typically cause problems for a Node.JS package.


## Copyright

(c) [À La Mode][1] 2018

[1]: https://alamode.cc
