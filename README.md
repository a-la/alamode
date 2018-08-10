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
  * [Output location](#output-location)
  * [Watch mode](#watch-mode)
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
  "description": "An Example project",
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
| <a name="output-location">Output location</a> | `-o`, `--output` | Where to produce output. |
| <a name="watch-mode">Watch mode</a> | `-w`, `--watch` | Keep `alamode` running and re-build on chages. |## Transforms

There are a number of built-in transforms, which don't need to be installed separetely because their size is small enough to be included as direct dependencies.

### `@a-la/import`

Changes all `import` statements into `require` statements. Although the specification between the [ECMAScript Modules](https://nodejs.org/api/esm.html) and [Modules](https://nodejs.org/api/modules.html) is different, most developers will prefer to use `import` just because of its neater syntax.

%EXAMPLE: example/import.js%

%FORK-js: src/bin/register example/import.js%

### `@a-la/export`

Transforms all `export` statements into `module.exports` statements. There are some limitations one should be aware about, however they will not typically cause problems for a Node.JS package.

%EXAMPLE: example/export.js%

## Copyright

(c) [À La Mode][1] 2018

[1]: https://alamode.cc
