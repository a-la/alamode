const { addHook } = require('pirates')
const { Script } = require('vm')

const accepted = [
  'Unexpected token export',
  'Unexpected token import',
]

// https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
function nthIndex(str, pat, n) {
  var L = str.length, i = -1
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i)
    if (i < 0) break
  }
  return i
}

const compile = (source, filename) => {
  try {
    const res = new Script(source, {
      filename,
    })
    return res
  } catch (err) {
    const isAccepted = accepted.includes(err.message)
    if (!isAccepted) throw err

    const lines = err.stack.split('\n', 3)
    /** @type {string} */
    const [line,, line3] = lines
    const ln = parseInt(line.substr(filename.length + 1))
    const col = line3.indexOf('^')
    const n = nthIndex(source, '\n', ln - 1)
    const nn = n + col + 1
    const sub = source.substr(nn)
    // substitute now
    console.log(sub)
    debugger
  }
}

// const m = Module
addHook(
  /** @param {string} source */
  (source, filename) => {

  }, { exts: ['.js'] })
require('./t2')
debugger