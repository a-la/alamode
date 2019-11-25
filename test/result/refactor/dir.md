## processes a directory
const abc = require('abc')
const def = require('def');
const { abc, cba } = require('abc')
const { def: ghi } = require('def')

exports = helloWorld
module.exports.parseErr = parseErr;

/* expected */
# dir/file.js

import abc from 'abc'
import def from 'def';
import { abc, cba } from 'abc'
import { def as ghi } from 'def'

export default helloWorld
export { parseErr };
/**/