#!/usr/bin/env node
import { _extensions, _help, _source, _ignore, _noSourceMaps, _output, _version, _jsx, _preact, _debug, argsConfig } from './get-args'
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
    })
  } catch (err) {
    if (process.env['DEBUG']) return console.log(err.stack)
    console.log(err.message)
  }
})()