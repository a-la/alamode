#!/usr/bin/env node
import { resolve } from 'path'
import { lstatSync } from 'fs'

import alamode from 'alamode'
alamode()

const p = resolve(process.argv[2])
const [node,,...rest] = process.argv
const files = rest.map((f) => {
  try {
    lstatSync(f)
    return resolve(f)
  } catch (err) {
    try {
      lstatSync(`${f}.js`)
      return resolve(f)
    } catch (er) {
      try {
        lstatSync(`${f}.jsx`)
        return resolve(f)
      } catch (e) {
        return f
      }
    }
  }
})
process.argv = [node, ...files]
require(p)