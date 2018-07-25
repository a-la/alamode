# alamode

[![npm version](https://badge.fury.io/js/alamode.svg)](https://npmjs.org/package/alamode)

`alamode` is a new Node.js npm package. A Node.js regex-based transpiler of source code.

```sh
yarn add -E alamode
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`alamode(arg1: string, arg2?: boolean)`](#alamodearg1-stringarg2-boolean-void)

## API

The package is available by importing its default function:

```js
import alamode from 'alamode'
```

### `alamode(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

```javascript
/* yarn example/ */
import alamode from 'alamode'

(async () => {
  await alamode()
})()
```

---

(c) [À La Mode][1] 2018

[1]: https://alamode.cc
