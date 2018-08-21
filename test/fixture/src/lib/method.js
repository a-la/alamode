/**
 * A library method to write `method`.
 * @param {Object} param0
 * @param {string} [param0.test] First string to test
 * @param {string} [param0.test2="hello-world"] Second string to test.
 */
const method = ({
  test,
  test2 = 'hello-world',
} = {}) => {
  process.stdout.write(' method: ')
  process.stdout.write(test ? test : test2)
  process.stdout.write('\n')
}

export default method