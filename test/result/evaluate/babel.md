// evaluates default + named
import erte, { c, b } from '../fixture/babel'

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
import erte from '../fixture/babel'

Object.assign(test, {
  erte: erte(),
})

/* expected */
{
  "erte": "erte"
}
/**/

// evaluates named
import { c, b } from '../fixture/babel'

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
import * as alamode from '../fixture/babel'

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
import erte, * as alamode from '../fixture/babel'

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