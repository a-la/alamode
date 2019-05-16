## CLI

The binary accepts a path to a single file, or a directory with the source code as the first argument, and a path to the build folder via `-o` argument.

```sh
alamode src -o build
```

There are other arguments which can be passed.

<argufy>types/arguments.xml</argufy>

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

%~ width="25"%

### `--help`

Shows all available commands.

%FORK src/bin/alamode -h%

%~%