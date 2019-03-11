const alamode = require('../..')
alamode()

// in other file
const path = require('path')
const preact = path.relative('', path
  .dirname(require.resolve('preact/package.json')))
alamode({
  pragma: `const { h } = require("./${preact}");`,
})