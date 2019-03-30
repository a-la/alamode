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
  ["[Ignore Paths](t)", "`-i`, `--ignore`", "A list of files inside of the source directory to ignore, separated with a comma. For example, to ignore `src/bin/alamode.js` when building `src`, the `-i bin/alamode.js` should be passed. A directory can also be passed, e.g., `-i bin` but without the `/` at the end."],
  ["[No Source Maps](t)", "`-s`, `--noSourceMaps`", "Don't generate source maps."],
  ["[Extensions](t)", "`-e`, `--extensions`", "Which extensions to transform, separated by a comma. Defaults are `js` and `jsx`."],
  ["[JSX](t)", "`-j`, `--jsx`", "Transpile JSX files but keep modular system. Usually used for Depack bundler."],
  ["[Preact](t)", "`-p`, `--preact`", "Adds the Preact `h` pragma at the top of JSX files."]
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

%~ width="15"%

### `--help`

Shows all available commands.

%FORK src/bin/alamode -h%

%~%