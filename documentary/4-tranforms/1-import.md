
### `@a-la/import`

Changes all `import` statements into `require` statements. Although the specification between the [ECMAScript Modules](https://nodejs.org/api/esm.html) and [Modules](https://nodejs.org/api/modules.html) is different, most developers will prefer to use `import` just because of its neater syntax.

%EXAMPLE: example/transforms/import.js%

%FORK-js src/bin/register example/transforms/import.js%

The `if (dependency && dependency.__esModule) dependency = dependency.default;` check is there to make `alamode` compatible with `babel`, which will export default modules in the `default` property of `module.exports` object and add the `__esModule` marker.
