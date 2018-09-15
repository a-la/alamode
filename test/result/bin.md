/// copies non-js file
test/fixture/test.svg

/* expected */
# test.svg

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg></svg>
/**/

/// transpiles a file
test/fixture/fixture.js -s

/* expected */
# fixture.js

let helloWorld = require('hello-world'); if (helloWorld && helloWorld.__esModule) helloWorld = helloWorld.default;

       const test = () => {
  const res = helloWorld()
  console.log(res)
}

module.exports.test = test
/**/

/// transpiles a directory
test/fixture/src -s

/* expected */
# index.js

const { libMethod } = require('./lib');

/**
 * The main function.
 */
               async function main () {
  await libMethod()
}

module.exports = main

# lib/index.js

let method = require('./method'); if (method && method.__esModule) method = method.default;

/**
 * A library method to write test.
 * @param {Date} [date] The date. Default is current date.
 */
       const libMethod = async (date = new Date()) => {
  const t = await Promise.resolve(`test - ${date.toUTCString()}`)
  process.stdout.write(t)
  method()
}

module.exports.libMethod = libMethod

# lib/method.js

/**
 * A library method to write `method`.
 * @param {Object} param0
 * @param {string} [param0.test] First string to test
 * @param {string} [param0.test2="hello-world"] Second string to test.
 */
const method = ({
  test,
  test2 = 'hello-world',
} = {}) => {
  process.stdout.write(' method: ')
  process.stdout.write(test ? test : test2)
  process.stdout.write('\n')
}

module.exports=method

# run.js

let main = require('.'); if (main && main.__esModule) main = main.default;

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
/**/

/* stdout */
Transpiled code saved to test/temp

/**/