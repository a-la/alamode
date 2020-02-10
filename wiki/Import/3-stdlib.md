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