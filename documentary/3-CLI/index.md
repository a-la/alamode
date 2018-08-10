
## CLI

The binary accepts a path to a single file, or a directory with the source code as the first argument, and a path to the build folder via `-o` argument.

```sh
alamode src -o build
```

There are other arguments which can be passed.

```table
[
  ["Property", "Argument", "Description"],
  ["[Output location](t)", "`-o`, `--output`", "Where to produce output."],
  ["[Watch mode](t)", "`-w`, `--watch`", "Keep `alamode` running and re-build on chages."]
]
```