# ÀLaMode

%NPM: alamode%

_ÀLaMode_ is  a RegExp-based transpiler of source code in Node.JS. It is a fast, low-weight alternative to AST-based transpilers, such as `@babel`. At the moment, it supports transpilation of `import` and `export` statements which also improves JSDoc support compared to _Babel_ which is an enemy of JSDoc.

```
yarn add -D alamode
```

%~%

The package can be used via the [CLI](#CLI) to build packages, or via the [require hook](#require-hook) to transform modules on-the-fly.

> If you're having trouble and still seeing `unknown keyword export`, check if your issue falls under the category described in the [troubleshooting](#troubleshooting). That's the single problem that we've seen after a year of using this software.

## Table Of Contents

%TOC%

%~%