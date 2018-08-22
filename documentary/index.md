# alamode

%NPM: alamode%

`alamode` is  a RegExp-based transpiler of source code in Node.js. It is a fast, low-weight alternative to AST-based transpilers, such as `@babel`. At the moment, it supports transpilation of `import` and `export` statements which also improves JSDoc support compared to _Babel_.

```
yarn add -DE alamode
```

The package can be used via the [CLI](#CLI) to build packages, or via the [require hook](#require-hook) to transform modules on-the-fly.

## Table Of Contents

%TOC%
