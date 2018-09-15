### `@a-la/import`

Changes all `import` statements into `require` statements. Although the specification between the [ECMAScript Modules](https://nodejs.org/api/esm.html) and [Modules](https://nodejs.org/api/modules.html) is different, most developers will prefer to use `import` just because of its neater syntax.

%EXAMPLE: example/transforms/import.js%

%FORK-js src/bin/alamode example/transforms/import.js%

The `if (dependency && dependency.__esModule) dependency = dependency.default;` check is there to make `alamode` compatible with _Babel_ and _TypeScript_, which export default modules as the `default` property of `module.exports` object and set the `__esModule` marker to true, e.g.,

```js
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = method;
```

#### Replace Path

This transform supports an option to replace the path to the required file using a regular expression. This can be useful when running tests against the build directory, rather than source directory.

```json
{
  "import": {
    "replacement": {
        "from": "^((../)+)src",
          "to": "$1build"
      }
    }
  }
}
```

%EXAMPLE: example/example.js%

```js
/* yarn example/ */
let alamode = require('../build'); if (alamode && alamode.__esModule) alamode = alamode.default;

(async () => {
  await alamode()
})()
```