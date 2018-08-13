const { chmodSync, lstatSync } = require('fs')

const copyMode = (input, output) => {
  const ls = lstatSync(input)
  const { mode } = ls
  chmodSync(output, mode)
}

module.exports.copyMode = copyMode