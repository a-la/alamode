/**
 * Example 1: named export (const).
 */
export const example1 = async () => {
  console.log('named export 1')
}

/**
 * Example 2: named export (function).
 */
export function example2() {
  console.log('named export 2')
}

/**
 * Example 3: declare a function and export later.
 */
function example3() {
  console.log('named export 3')
}

/**
 * Example 4: declare an async function and export later with an alias.
 */
const example4 = async () => {
  console.log('named export 4')
}

export { example3, example4 as alias4 }

/**
 * Default Class Example.
 */
export default class Example {
  /**
   * A constructor for the example.
   * @constructor
   */
  constructor() {
    console.log('default export')
  }
}