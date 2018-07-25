
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

<!--
 <tr>

```sh
alamode src -o build
```
  </td>
 </tr> -->
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

%EXAMPLE: example/build.js, ../src => alamode, js%
  </td>
 </tr>
 <tr>
  <td>yarn build</td>
  <td>npm run build</td>
 </tr>
 <tr>
  <td colspan="2">

%EXAMPLE: example/package.json, ../src => alamode, json5%
  </td>
 </tr>
</tbody>
</table>
