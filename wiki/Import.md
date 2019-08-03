<!-- ### `@a-la/import` -->

Changes all `import` statements into `require` statements. Although the specification between the [ECMAScript Modules](https://nodejs.org/api/esm.html) and [Modules](https://nodejs.org/api/modules.html) is different, most developers will prefer to use `import` just because of its neater syntax.

%EXAMPLE: example/transforms/import%

%FORK-js src/bin/alamode example/transforms/import.js -s%

The options that can be set in the `.alamoderc.json` are described below.

## On This Page

%TOC%

%~%

## esModule

The `if (dependency && dependency.__esModule) dependency = dependency.default;` check is there to make `alamode` compatible with _Babel_ and _TypeScript_ that export default modules as the `default` property of `module.exports` object and set the `__esModule` marker to true, e.g.,

```js
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = method;
```

The check will only be added for external modules, and the _Node.JS_ core dependencies as well as those that start with `.` or `/` will be required without the `__esModule` check. To enforce the check for any file, the `esCheck: always` should be set in the transform configuration. To disable the check for specific modules, they are added to the `alamodeModules` directive.

```json5
{
  "import": {
    "esCheck": "always", // adds the check for each default import
    "alamodeModules": ["restream"] // disables the check for packages
  }
}
```

If neither `esCheck` nor `alamodeModules` are present, _ÀLaMode_ will look up the _package.json_ of the module and see if it includes the `"alamode": true` property, and won't add the check if it does.

%~%

## Replace Path

This transform supports an option to replace the path to the required file using a regular expression. This can be useful when running tests against the build directory, rather than source directory.

```json5
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

<table>
<tr><th><a href="example/index.js">Source</a></th><th>Replaced Source</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example%
</td>
<td>

```js
const myPackage = require('../build');

(async () => {
  await myPackage()
})()
```
</td></tr>
</table>

This is how we have set up all our [_Zoroaster_](/contexttesting/zoroaster) tests which natively use _ÀLaMode_: during the development, it's always good to require the source code, however just before the release, the `test-build` command is run. If the package publishes `build/index.js` as its `main` field of _package.json_, it's even possible to specify the config just to point to the root of the project directory.

If the package publishes a single file compiled with [_Depack_](/dpck/depack), whereas test will import library methods for unit tests also from `src` dir, the `$` must be added.

```json5
{
  "env": {
    "test-build": {
      "import": {
        "replacement": {
          "from": "^((../)+)src$",
          "to": "$1"
        }
      }
    }
  },
}
```

See [@Depack/cache](https://github.com/dpck/cache/blob/master/package.json) for an example of Depack-compiled project.

%~%

## `stdlib`

With the advent of _Depack_, the Node.JS source code compiler based off _Google Closure Compiler_, it became possible to assemble all internal and external dependencies into a single file. However, for bigger and more complex projects it might not be necessary to compile the actual source code, but rather create a packed library of all dependencies that it uses, and update the source code to point to it after build. The dev environment stays the same and is left intact for testing.

For example, [_Documentary_](/artdecocode/documentary/blob/master/src/stdlib.js) defines the library in the following way:

```js
import clearr from 'clearr'
import erte, { c, b } from 'erte'
import forkfeed from 'forkfeed'
import makepromise from 'makepromise'
// ...
module.exports = {
  'clearr': clearr,
  'c': c,
  'b': b,
  'erte': erte,
  'forkfeed': forkfeed,
  'makepromise': makepromise,
  // ...
}
```

With the `stdlib` option, _ÀLaMode_ will source all dependencies from a single file. This means that all source files must name default imports consistently with the standard library that was compiled for the project. Read more about compilation on [_Depack_'s page](https://github.com/dpck/depack#standard-libarary).

_Given the following rc file:_

```json
{
  "env": {
    "stdlib-wiki": {
      "import": {
        "stdlib": {
          "path": "stdlib.js",
          "packages": ["rexml", "example", "import"]
        }
      }
    }
  }
}
```

_ÀLaMode will repoint all imports to the library file:_

<table>
<tr><th><a href="../blob/master/example/stdlib.js">Source</a></th><th>Output</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/stdlib%
</td>
<td>

<fork lang="js" env="ALAMODE_ENV=stdlib-wiki">src/bin example/stdlib.js -s</fork>
</td></tr>
</table>

The transform will preserve line numbers. 