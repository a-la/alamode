/**
 * A library method to write `method`.
 * @param {boolean} [test=false] Whether to test.
 */
const method = (test) => {
  process.stdout.write(test ? 'method\n' : `method: ${test}\n`)
}

export default method