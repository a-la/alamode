# ÀLaMode

%NPM: alamode%

_ÀLaMode_ is a RegExp-based transpiler of source code in _Node.JS_. It is a neat, fast, low-weight alternative to AST-based transpilers, such as `@babel`. At the moment, it supports transpilation of `import` and `export` statements including source map support for debugging, and that greatly improves _JSDoc_ compared to _Babel_ which is an enemy of _JSDoc_ (see below). If you only want `import` and `export` statements, don't disrespect yourself by continuing to use _Babel_, switch to **ÀLaMode** today. It also can transpile JSX (with a few limitations).

```
yarn add -D alamode
```

%~%

The package can be used via the [CLI](#CLI) to build packages, or via the [require hook](#require-hook) to transform modules on-the-fly.

<table>
<tr><th>Source Code</th><th>Transpiled Code</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/class%
</td>
<td>

%EXAMPLE: node_modules/@a-la/fixture-alamode/build/class%
</td></tr>
</table>

<details>
<summary>Show Babel Output</summary>

%EXAMPLE: node_modules/@a-la/fixture-babel/build/class%
</details>

> If you're having trouble and still seeing `unknown keyword export`, check if your issue falls under the category described in the [troubleshooting](#troubleshooting). That's the single problem that we've seen after a year of using this software.

## Table Of Contents

%TOC%

%~%