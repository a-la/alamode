# alamode

[![npm version](https://badge.fury.io/js/alamode.svg)](https://npmjs.org/package/alamode)

`alamode` is RegExp-based transpiler of source code in Node.js. It is a fast, low-weight alternative to AST-based transpilers, such as `@babel`.

## Installation

`aty` can be either installed globally, or as a library. The library can be used either programmatically, or via `package.json` to refer to a binary in `node_modules/.bin` from a `yarn` or `npm` script.

### Global

Install as a global binary from <a href="#cli">CLI</a> and use to transpile source code files.

<table>
<thead>
 <tr>
  <th>Installation Command</th>
  <th>Example</th>
 </tr>
</thead>

<tbody>
 <tr>
  <td align="center">
   <em>

npm i -g alamode
</em>
  </td>
  <td>

```sh
alamode src -o build
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
  <th>Example</th>
 </tr>
</thead>
<tbody>
 <tr>
  <td rowspan="3" align="center"><em>

```sh
yarn add -DE alamode
```
</em></td>
  <td>
   <code>1) node build</code>

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
 <tr></tr>
 <tr>
  <td>
   <code>2) yarn build</code>

```json
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

The demo below shows how one can use `aty` to automatically type a program which they just wrote.

<table>
<tbody>
<tr>
</tr>
<tr>
<td><a name="programming-like-a-hacker-with-aty">Programming like a hacker with aty</a></td>
</tr>
<tr>
<td><img src="doc/appshot-aty2.gif" alt="Harry you're a hacker - writing a program with aty."></td>
</tr>
</tbody></table>

## Table Of Contents

- [Installation](#installation)
  * [Global](#global)
  * [Dependency](#dependency)
- [Demo](#demo)
  * [Programming like a hacker with aty](#programming-like-a-hacker-with-aty)
- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`alamode(arg1: string, arg2?: boolean)`](#alamodearg1-stringarg2-boolean-void)
- [Copyright](#copyright)

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
