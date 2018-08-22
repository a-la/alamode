#!/usr/bin/env node
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
let usually = require('usually'); if (usually && usually.__esModule) usually = usually.default;
const { version } = require('../../package.json')
let catcher = require('./catcher'); if (catcher && catcher.__esModule) catcher = catcher.default;
const { transpile } = require('./transpile')

const {
  input: _input,
  output: _output,
  version: _version,
  help: _help,
  ignore: _ignore,
  noSourceMaps: _noSourceMaps,
} = argufy({
  input: { command: true },
  output: { short: 'o' },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
  ignore: { short: 'i' },
  noSourceMaps: { short: 's', boolean: true },
})

if (_help) {
  const usage = usually({
    usage: {
      source: `Location of the input to the transpiler,
either a directory or a file.`,
      '--output, -o': `Location to save results to. Passing "-"
will print to stdout when source is a file.`,
      '--help, -h': 'Display help information.',
      '--version, -v': 'Show version.',
      '--ignore, -i': `Paths to files to ignore, relative to
source.`,
      '--noSourceMaps, -s': 'Don\'t generate source maps.',
    },
    description: 'A tool to transpile JavaScript packages using regular expressions.',
    line: 'alamode source [-o destination]',
    example: 'alamode src -o build',
  })
  console.log(usage)
  process.exit()
} else if (_version) {
  console.log('v%s', version)
  process.exit()
}

(async () => {
  try {
    const ignore = _ignore ? _ignore.split(','): []
    await transpile({
      input: _input,
      output: _output,
      noSourceMaps: _noSourceMaps,
      ignore,
    })
  } catch (err) {
    catcher(err)
  }
})()
//# sourceMappingURL=index.js.map