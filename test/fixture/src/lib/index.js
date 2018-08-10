import method from './method'

/**
 * A library method to write test.
 * @param {Date} [date] The date. Default is current date.
 */
export const libMethod = async (date = new Date()) => {
  const t = await Promise.resolve(`test - ${date.toUTCString()}`)
  process.stdout.write(t)
  method()
}