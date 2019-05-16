# ÀLaMode

%NPM: alamode%

_ÀLaMode_ is a RegExp-based transpiler of source code in _Node.JS_ that supports transpilation of `import` and `export` statements including source map for debugging, while keeping the original code pretty much the same (no _interrop_ require). It also can transpile JSX (without source maps ATM and some minor limitations).

The package can be used via the [CLI](#CLI) to build packages, or via the [require hook](#require-hook) to transform modules on-the-fly.

```
yarn add -D alamode
```

%~%