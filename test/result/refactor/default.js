// refactors default require
const abc = require('abc')
const def = require('def');
const ghi = require("ghi")

/* expected */
import abc from 'abc'
import def from 'def';
import ghi from "ghi"
/**/

// refactors named require
const { abc, cba } = require('abc')
const { def: ghi } = require('def')
const { a: b, c:d, e } = require('test')

/* expected */
import { abc, cba } from 'abc'
import { def as ghi } from 'def'
import { a as b, c as d, e } from 'test'
/**/
