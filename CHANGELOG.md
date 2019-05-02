## 2 May 2019

### [2.1.1](https://github.com/a-la/alamode/compare/v2.1.0...v2.1.1)

- [fix] Resolve only the path to the script using _ÀLaNode_.

## 1 May 2019

### [2.1.0](https://github.com/a-la/alamode/compare/v2.0.0...v2.1.0)

- [depack] Build w/out polyfills (https://github.com/google/closure-compiler/issues/3356).

## 24 April 2019

### [2.0.0](https://github.com/a-la/alamode/compare/v1.9.3...v2.0.0)

- [build] Compile with _Depack_.

## 11 April 2019

### [1.9.3](https://github.com/a-la/alamode/compare/v1.9.2...v1.9.3)

- [deps] Update and unlock more dependencies.

## 3 April 2019

### [1.9.2](https://github.com/a-la/alamode/compare/v1.9.1...v1.9.2)

- [deps] Tilda some deps.

### [1.9.1](https://github.com/a-la/alamode/compare/v1.9.0...v1.9.1)

- [deps] Update deps.

## 30 March 2019

### [1.9.0](https://github.com/a-la/alamode/compare/v1.8.6...v1.9.0)

- [feature] Supply `alanode` binary.

## 19 March 2019

### 1.8.6

- [fix] Upgrade `@a-la/jsx` to fix the bug with closing tag detection.

## 14 March 2019

### 1.8.5

- [fix] Do not throw when processing empty files.

## 11 March 2019

### 1.8.4

- [fix] Revert the `global.ALAMODE_JSX?` before updating it when the require hook is called multiple times.

## 17 February 2019

### 1.8.3

- [deps] Update dependencies.

## 16 February 2019

### 1.8.2

- [fix] Update `@a-la/jsx` to _v1.4.2_.
- [test] Test the `require` hook for JSX with masks.

## 14 February 2019

### 1.8.1

- [fix] Also ignore directories with `-i` flag.

## 11 February 2019

### 1.8.0

- [feature] Transpile JSX modules via CLI.

## 1 February 2019

### 1.7.3

- [fix] Update `@a-la/jsx` to _v1.2.5_.

## 30 January 2019

### 1.7.2

- [fix] Up `@a-la/jsx` to fix missing `mismatch`.

## 28 January 2019

### 1.7.1

- [fix] Up `@a-la/jsx` to fix the bug when tags start with an expression.

## 24 January 2019

### 1.7.0

- [feature] Add `JSX` hook.

## 9 December 2018

### 1.6.1

- [deps] Install `catchment` as the prod dependency.

### 1.6.0

- [feature] Do not add the `esCheck` to local imports. Add an option to always add the check with `esCheck: always`.

## 9 October 2018

### 1.6.0

- [feature] Do not add the `esCheck` to local imports. Add an option to always add the check with `esCheck: always`.

## 20 September 2018

### 1.5.1

- [fix] Update to `@a-la/import@1.6.2` to fix the order of default destructuring for `Babel` packages.

## 15 September 2018

### 1.5.0

- [feature] Add an option to specify extensions.
- [deps] Up `@wrote/ensure-path`.

## 1 September 2018

### 1.4.0

- [feature] Ignore strings and regexes.
- [doc] Write about troubleshooting, add `TODO`.

## 27 August 2018

### 1.3.0

- [feature] `import def, * as` statement.
- [fix] `@a-la/export`: correct `export class X extends Y`, `@a-la/import`: add semicolon after require.

## 22 August 2018

### 1.2.1

- [fix] Read config for the require hook as well.

### 1.2.0

- [feature] Implement the require hook, ignore files, generate source maps, `.alamoderc`.

## 13 August 2018

### 1.1.0

- [feature] Working `CLI` with `import` and `export` transforms.
- [test] Integration tests.
- [doc] Documentation of the usage and transforms.

## 25 July 2018

### 1.0.3

- [doc] Reference `cdn.rawgit.com` for logos.

### 1.0.2

- [doc] Document how to install w/ `npm`, add `yarn` and `npm` logos.

### 1.0.1

- [doc] Add `npm` usage example for dependency installation.

### 1.0.0

- Create `alamode` with [`mnp`][https://mnpjs.org]
- [repository]: `src`, `test`
