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

import { _extensions, _help, _source, _ignore, _noSourceMaps, _output,
  _version, _jsx, _preact, _debug, argsConfig, _module } from './get-args'
import { reduceUsage } from 'argufy'
import { transpile } from './transpile'
import getUsage from './usage'

if (_help) {
  const usage = getUsage(reduceUsage(argsConfig))
  console.log(usage)
  process.exit()
} else if (_version) {
  console.log('v%s', require('../../package.json')['version'])
  process.exit()
}

(async () => {
  try {
    const ignore = _ignore ? _ignore.split(',') : []
    const extensions = _extensions.split(',')
    await transpile({
      input: _source,
      output: _output,
      noSourceMaps: _noSourceMaps,
      ignore,
      extensions,
      jsx: _jsx,
      preact: _preact,
      debug: _debug,
      mod: _module,
    })
  } catch (err) {
    if (process.env['DEBUG']) return console.log(err.stack)
    console.log(err.message)
  }
})()