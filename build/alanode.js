#!/usr/bin/env node

/**
 * @license
 * ALaMode: transpiler of import/export statements and JSX components.
 *
 * Copyright (C) 2019  Art Deco
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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