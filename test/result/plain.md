plain means without esChecks for known packages as well as
no whitespace to replace export with, due 2 no source maps

## uses plain output
src -s

```js file */
import test from 'test'
export default class Test {

}
export const hello = 123
const world = 456
export { world }
```

```json alamoderc */
{
  "import": {
    "alamodeModules": ["test"]
  }
}
```

```js expected */
// input.js

const test = require('test');
class Test {

}
const hello = 123
const world = 456


module.exports = Test
module.exports.hello = hello
module.exports.world = world
```

## renames paths in JSX
src -s

```js file */
import './style.css'
import { Style } from './style.css'
```

```json alamoderc */
{
  "import": {
    "replacement": {
      "from": "^(.+)/(.+).css$",
      "to": "$1/closure.css"
    }
  }
}
```

```ext
jsx
```

```js expected */
// input.js

import './closure.css'
import { Style } from './closure.css'
```