const e = `
  export { test } from 'test'
`

const i = `
  import test from 'test'
`

import main from '.'

// test

/**
 * test
 */
debugger

(async () => {
  debugger
  console.log(123); /* console.log(456); */ console.log(456)
  await main() // ok node
})()