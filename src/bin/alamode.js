#!/usr/bin/env node
import argufy from 'argufy'
import { version } from '../../package.json'
import catcher from './catcher'
import { transpile } from './transpile'
import getUsage from './usage'

const {
  input: _input,
  output: _output,
  version: _version,
  help: _help,
  ignore: _ignore,
  noSourceMaps: _noSourceMaps,
  extensions: _extensions,
} = argufy({
  input: { command: true },
  output: { short: 'o' },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
  ignore: { short: 'i' },
  noSourceMaps: { short: 's', boolean: true },
  extensions: { short: 'e' },
})

if (_help) {
  const usage = getUsage()
  console.log(usage)
  process.exit()
} else if (_version) {
  console.log('v%s', version)
  process.exit()
}

(async () => {
  try {
    const ignore = _ignore ? _ignore.split(',') : []
    const extensions = _extensions ? _extensions.split(',') : ['js', 'jsx']
    await transpile({
      input: _input,
      output: _output,
      noSourceMaps: _noSourceMaps,
      ignore,
      extensions,
    })
  } catch (err) {
    catcher(err)
  }
})()