import Stream from 'stream'
import { join } from 'stream'

export default class S extends Stream {
  /**
   * Creates a new instance.
   * @param {string} path
   */
  constructor(path) {
    super()
    console.log(join('hello', path))
  }
}

/**
 * A function that returns `c`.
 * @param {string} input
 */
export const c = (input = '') => {
  return 'c' + input ? `-${input}` : ''
}

/**
 * A function that returns `b`.
 * @param {number} times
 */
export const b = (times = 0) => {
  return 'b' + times ? `-${times}` : ''
}



​