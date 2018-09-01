
## CLI

The binary accepts a path to a single file, or a directory with the source code as the first argument, and a path to the build folder via `-o` argument.

```sh
alamode src -o build
```

There are other arguments which can be passed.

```table
[
  ["Property", "Argument", "Description"],
  ["[Output Location](t)", "`-o`, `--output`", "Where to save transpiled code. Passing `-` will print to `stdout`."],
  ["[Watch Mode](t)", "`-w`, `--watch`", "Keep `alamode` running and re-build on chages."],
  ["[Show Help](t)", "`-h`, `--help`", "Display help information and quit."],
  ["[Ignore Paths](t)", "`-i`, `--ignore`", "A list of files inside of the source directory to ignore, separated with a comma. For example, to ignore `src/bin/alamode.js` when building `src`, the `-i bin/alamode.js` should be passed"],
  ["[No Source Maps](t)", "`-s`, `--noSourceMaps`", "Don't generate source maps."]
]
```

Setting the [`NODE_DEBUG`](t) environmental variable to `alamode` will print the list of processed files to the `stderr`.

```sh
$ NODE_DEBUG=alamode alamode src -o build -i bin/alamode.js
```

```fs
ALAMODE 97955: index.js
ALAMODE 97955: bin/catcher.js
ALAMODE 97955: bin/index.js
ALAMODE 97955: lib/index.js
```