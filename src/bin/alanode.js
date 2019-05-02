#!/usr/bin/env node
import { resolve } from 'path'
import { lstatSync } from 'fs'

import alamode from 'alamode'
alamode()

const p = resolve(process.argv[2])
const [node,,...rest] = process.argv

let scriptFound = false
const files = rest.map((f) => {
  if (scriptFound) return f
  try {
    lstatSync(f)
    scriptFound = true
    return resolve(f)
  } catch (err) {
    try {
      lstatSync(`${f}.js`)
      scriptFound = true
      return resolve(f)
    } catch (er) {
      try {
        lstatSync(`${f}.jsx`)
        scriptFound = true
        return resolve(f)
      } catch (e) {
        return f
      }
    }
  }
})

process.argv = [node, ...files]
require(p)