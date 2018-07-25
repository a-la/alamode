# alamode

[![npm version](https://badge.fury.io/js/alamode.svg)](https://npmjs.org/package/alamode)

`alamode` is  a RegExp-based transpiler of source code in Node.js. It is a fast, low-weight alternative to AST-based transpilers, such as `@babel`.


## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Installation](#installation)
  * [Global](#global)
  * [Dependency](#dependency)
- [Demo](#demo)
  * [Using Package.json Script To Transpile](#using-packagejson-script-to-transpile)
- [CLI](#cli)
- [API](#api)
  * [`alamode(arg1: string, arg2?: boolean)`](#alamodearg1-stringarg2-boolean-void)
- [Copyright](#copyright)

## Installation

`alamode` can be either installed globally, or as a library. The library can be used either programmatically, or via `package.json` to refer to a binary in `node_modules/.bin` from a `yarn` or `npm` script.

### Global

Install as a global binary from <a href="#cli">CLI</a> and use to transpile source code files.

<table>
<thead>
 <tr>
  <th>Installation Command</th>
  <th>Usage Command</th>
 </tr>
</thead>

<tbody>
 <tr>
  <td rowspan="3" align="center">
   <em>npm i -g alamode</em>
  </td>
  <td>yarn build</td>
 </tr>

 <tr>
  <td>

```js
/* project structure */
src
└── index.js
build
├── index.js
└── index.js.map
```
</td>
 </tr>

</tbody>
</table>

### Dependency

Install as a dependency and use <a href="#api">API</a> to run programmatically in other Node.js software, or access the `alamode` binary via a `yarn` or `npm` script.

<table>
<thead>
 <tr>
  <th>Installation Command</th>
  <th colspan="2">Usage Command</th>
 </tr>
</thead>
<tbody>
 <tr>
  <td rowspan="4" align="center">
   <em>yarn add -DE alamode</em>
  </td>
  <td colspan="2">node build</td>
 </tr>
 <tr>
  <td colspan="2">

```js
/* build.js */
import alamode from 'alamode'

const src = 'src'
const output = 'build'

;(async () => {
  await alamode({
    src,
    output,
  })
})()
```
  </td>
 </tr>
 <tr>
  <td>yarn build</td>
  <td>npm run build</td>
 </tr>
 <tr>
  <td colspan="2">

```json5
// package.json
{
  "name": "project",
  "version": "1.0.0",
  "description": "Example.",
  "main": "build",
  "scripts": {
    "test": "zoroaster test/spec",
    "build": "alamode src -o build"
  },
  "files": [
    "build"
  ],
  "license": "MIT",
  "devDependencies": {},
  "dependencies": {}
}
```
  </td>
 </tr>
</tbody>
</table>

## Demo

In the demo below, a project's `src` directory is transpiled to replace `import` and `export` statements and placed in the `build` directory.

<table>
<tbody>
<tr>
</tr>
<tr>
<td><a name="using-packagejson-script-to-transpile">Using Package.json Script To Transpile</a></td>
</tr>
<tr>
<td><img src="doc/appshot-alamode.gif" alt="Transpiling a project's source code into build dir."></td>
</tr>
</tbody></table>

## CLI

```sh
alamode src -o build
```

## API

The package is available by importing its default function:

```js
import alamode from 'alamode'
```

### `alamode(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

```javascript
/* yarn example/ */
import alamode from 'alamode'

(async () => {
  await alamode()
})()
```

## Copyright

(c) [À La Mode][1] 2018

[1]: https://alamode.cc
