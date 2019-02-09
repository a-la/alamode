#!/usr/bin/env node
const { version } = require('../../package.json');
const catcher = require('./catcher');
const { transpile } = require('./transpile');
const getUsage = require('./usage');
const { _extensions, _help, _input, _ignore, _noSourceMaps, _output, _version, _jsx, _preact } = require('./args');


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
    const extensions = _extensions.split(',')
    await transpile({
      input: _input,
      output: _output,
      noSourceMaps: _noSourceMaps,
      ignore,
      extensions,
      jsx: _jsx,
      preact: _preact,
    })
  } catch (err) {
    catcher(err)
  }
})()