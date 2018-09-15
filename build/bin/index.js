#!/usr/bin/env node
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
const { version } = require('../../package.json');
let catcher = require('./catcher'); if (catcher && catcher.__esModule) catcher = catcher.default;
const { transpile } = require('./transpile');
let getUsage = require('./usage'); if (getUsage && getUsage.__esModule) getUsage = getUsage.default;

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
//# sourceMappingURL=index.js.map