
## Compiling JSX: `--jsx, --preact`

ÀLaMode can transpile JSX syntax. In the `jsx` mode, the `import/export` statements will be left intact, but the source code will be transformed to add pragma invocations, such as `h(Component, { props }, children)`. The default pragma is `h` for Preact, and to avoid writing `import { h } from 'preact'` in each file, the `-p` option can be passed for ÀLaMode to add it automatically.

_For example, the following file can be compiled:_

%EXAMPLE: example/index.jsx%

_Using the `alamode example/index.jsx -j -p` command:_

%FORK-js src/bin example/index.jsx -j -p%

%~%