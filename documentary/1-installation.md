## Installation

The software can be installed either as a global dependency, or as a project dependency.

### Global

When installed globally, it will be used directly via a binary, such as `alamode src -o build`.

```table
[
  ["Package Manager", "Installation"],
  ["<img src='https://cdn.rawgit.com/a-la/alamode/HEAD/doc/Npm-logo.svg' height='16'> npm", "`npm i -g alamode`"],
  ["<img src='https://cdn.rawgit.com/a-la/alamode/HEAD/doc/yarn-kitten.svg' height='16'> yarn", "`yarn add global alamode`"]
]
```

### Project

When installed in a project, it will be used via the `package.json` script, e.g., `yarn build` or `npm run build`.

%EXAMPLE: example/package.json, ../src => alamode, json5%

```table
[
  ["Package Manager", "Installation"],
  ["<img src='https://cdn.rawgit.com/a-la/alamode/HEAD/doc/Npm-logo.svg' height='16'> npm", "`npm i --save-dev alamode`"],
  ["<img src='https://cdn.rawgit.com/a-la/alamode/HEAD/doc/yarn-kitten.svg' height='16'> yarn", "`yarn add -DE alamode`"]
]
```

%~%