import helloWorld from 'hello-world'

export const test = () => {
  const res = helloWorld()
  console.log(res)
}

export { test2 } from 'test'

const i = `
  import helloWorld from 'hello-world'
`
const e = `
  export { test } from 'test'
`