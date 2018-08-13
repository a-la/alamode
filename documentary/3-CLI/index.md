
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
  ["[Show Version](t)", "`-v`, `--version`", "Display version number and quit."]
]
```