// this is an advanced fixture file, where strings are replaced
let helloWorld = require('hello-world'); if (helloWorld && helloWorld.__esModule) helloWorld = helloWorld.default;

       const test = () => {
  const res = helloWorld()
  console.log(res)
}

const $test = require('test');

const i = `
  import helloWorld from 'hello-world'
`
const e = `
  export { test } from 'test'
`

module.exports.test = test
module.exports.test2 = $test.test2