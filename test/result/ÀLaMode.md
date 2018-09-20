// transpiles default and named imports
import def, { test } from 'package'

/* expected */
let def = require('package'); const { test } = def; if (def && def.__esModule) def = def.default;
/**/