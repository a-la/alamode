#!/usr/bin/env node
const { resolve } = require('path');
const { lstatSync } = require('fs');

const alamode = require('alamode');
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