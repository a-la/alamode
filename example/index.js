require('@babel/register')
const { resolve } = require('path')

const p = resolve(__dirname, '..', process.argv[2])
require(p)
