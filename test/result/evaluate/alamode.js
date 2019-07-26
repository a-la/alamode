let test

// evaluates default + named
import erte, { c, b } from '@a-la/fixture-alamode'

Object.assign(test, {
  c: c(),
  b: b(),
  erte: erte(),
});

/* expected */
({
  c: 'c',
  b: 'b',
  erte: 'erte',
})
/**/

// evaluates default
import erte2 from '@a-la/fixture-alamode'

Object.assign(test, {
  erte: erte2(),
});

/* expected */
({
  erte: 'erte',
})
/**/

// evaluates named
import { c as c2, b as b2 } from '@a-la/fixture-alamode'

Object.assign(test, {
  c: c2(),
  b: b2(),
});

/* expected */
({
  c: 'c',
  b: 'b',
})
/**/

// evaluates as
import * as alamode from '@a-la/fixture-alamode'

Object.assign(test, {
  c: alamode.c(),
  b: alamode.b(),
});

/* expected */
({
  c: 'c',
  b: 'b',
})
/**/

// evaluates as with default
import erte3, * as alamode2 from '@a-la/fixture-alamode'

Object.assign(test, {
  erte: erte3(),
  c: alamode2.c(),
  b: alamode2.b(),
});

/* expected */
({
  erte: 'erte',
  c: 'c',
  b: 'b',
})
/**/