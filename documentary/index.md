# alamode

%NPM: alamode%

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

%EXAMPLE: example/build.js, ../src => alamode, js%
  </td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   <code>2) yarn build</code>

%EXAMPLE: example/package.json%
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
<td>[Programming like a hacker with aty](t)</td>
</tr>
<tr>
<td><img src="doc/appshot-aty2.gif" alt="Harry you're a hacker - writing a program with aty."></td>
</tr>
</tbody></table>

## Table Of Contents

%TOC%
