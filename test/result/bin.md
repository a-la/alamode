// !transpiles a file
test/fixture/fixture.js

/* expected */
# fixture.js

// this is a fixture file
let helloWorld = require('hello-world')

export const test = () => {
  const res = helloWorld()
  console.log(res)
}
/**/

// transpiles a directory
test/fixture/src

/* expected */
123
/**/

/* stdout */
Transpiled code saved to test/temp

/**/