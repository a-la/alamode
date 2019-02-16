// transpiles default and named imports
import def, { test } from 'package'

/* expected */
let def = require('package'); const { test } = def; if (def && def.__esModule) def = def.default;
/**/

// keeps local default imports without __esModule check
import def from './package'

/* expected */
const def = require('./package');
/**/