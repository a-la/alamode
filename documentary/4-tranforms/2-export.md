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

%EXAMPLE: example/transforms/export.js%
  </td>
  <td>

%FORK-js src/bin example/transforms/export.js%
  </td>
 </tr>
</tbody>
</table>

There are some [limitations](https://github.com/a-la/export#limitations) one should be aware about, however they will not typically cause problems for a Node.JS package. The line and column numbers are preserved for easier generation of the source maps, however this is likely to change in the future.

<!-- There are some limitations, such as: -->

<!-- - When a default is exported along with named exports, `module.exports` will be bound to the default, and named exports will become properties of the default object. This means a default cannot be a primitive such as number, string or boolean.
- When a default is a function, in strict mode it will not be possible to assign some properties to it, e.g., name. Therefore it is impossible to do something like: -->