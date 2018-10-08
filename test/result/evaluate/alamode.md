// evaluates default + named
import erte, { c, b } from '@a-la/fixture-alamode'

Object.assign(test, {
  c: c(),
  b: b(),
  erte: erte(),
})

/* expected */
{
  "c": "c",
  "b": "b",
  "erte": "erte"
}
/**/

// evaluates default
import erte from '@a-la/fixture-alamode'

Object.assign(test, {
  erte: erte(),
})

/* expected */
{
  "erte": "erte"
}
/**/

// evaluates named
import { c, b } from '@a-la/fixture-alamode'

Object.assign(test, {
  c: c(),
  b: b(),
})

/* expected */
{
  "c": "c",
  "b": "b"
}
/**/

// evaluates as
import * as alamode from '@a-la/fixture-alamode'

Object.assign(test, {
  c: alamode.c(),
  b: alamode.b(),
})

/* expected */
{
  "c": "c",
  "b": "b"
}
/**/

// evaluates as with default
import erte, * as alamode from '@a-la/fixture-alamode'

Object.assign(test, {
  "erte": erte(),
  c: alamode.c(),
  b: alamode.b(),
})

/* expected */
{
  "erte": "erte",
  "c": "c",
  "b": "b"
}
/**/