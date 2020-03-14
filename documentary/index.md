# ÀLaMode

%NPM: alamode%
[![Build status](https://ci.appveyor.com/api/projects/status/owaagwyeh6b8pwc5?svg=true)](https://ci.appveyor.com/project/4r7d3c0/alamode)
![Node.js CI](https://github.com/a-la/alamode/workflows/Node.js%20CI/badge.svg)

_ÀLaMode_ is a RegExp-based transpiler of source code in _Node.JS_ that supports transpilation of `import` and `export` statements including source map for debugging, while keeping the original code pretty much the same (no _interop_ require). It also can transpile JSX (without source maps ATM and some minor limitations).

The package can be used via the [CLI](#CLI) to build packages, or via the [require hook](#require-hook) to transform modules on-the-fly.

> If you've tried it and are having trouble seeing `unknown keyword export`, check if your issue falls under the category described in the [troubleshooting](#troubleshooting). That's the single problem that we've seen after a year of using this software.

```
yarn add -D alamode
npm i --save-dev alamode
```

%~%