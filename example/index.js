const { resolve } = require('path')
require('..')()

const p = resolve(__dirname, '..', process.argv[2])
require(p)
