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