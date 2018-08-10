## Transforms

There are a number of built-in transforms, which don't need to be installed separetely because their size is small enough to be included as direct dependencies.

### `@a-la/import`

Changes all `import` statements into `require` statements. Although the specification between the [ECMAScript Modules](https://nodejs.org/api/esm.html) and [Modules](https://nodejs.org/api/modules.html) is different, most developers will prefer to use `import` just because of its neater syntax.

%EXAMPLE: example/import.js%

%FORK-js: src/bin/register example/import.js%

### `@a-la/export`

Transforms all `export` statements into `module.exports` statements. There are some limitations one should be aware about, however they will not typically cause problems for a Node.JS package.

%EXAMPLE: example/export.js%
