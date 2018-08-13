
### `@a-la/export`

Transforms all `export` statements into `module.exports` statements.

%EXAMPLE: example/transforms/export.js%

%FORK-js src/bin/register example/transforms/export.js%

There are some [limitations](https://github.com/a-la/export#limitations) one should be aware about, however they will not typically cause problems for a Node.JS package.

<!-- There are some limitations, such as: -->

<!-- - When a default is exported along with named exports, `module.exports` will be bound to the default, and named exports will become properties of the default object. This means a default cannot be a primitive such as number, string or boolean.
- When a default is a function, in strict mode it will not be possible to assign some properties to it, e.g., name. Therefore it is impossible to do something like: -->