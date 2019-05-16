plain means without esChecks for known packages as well as
no whitespace to replace export with, due 2 no source maps

## uses plain output
src -s

/* file */
import test from 'test'
export default class Test {

}
export const hello = 123
const world = 456
export { world }
/**/

/* alamoderc */
{
  "import": {
    "alamodeModules": ["test"]
  }
}
/**/

/* expected */
# input.js

const test = require('test');
class Test {

}
const hello = 123
const world = 456


module.exports = Test
module.exports.hello = hello
module.exports.world = world
/**/