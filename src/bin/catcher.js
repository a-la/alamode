import { debuglog } from 'util'

const LOG = debuglog('alamode')
const DEBUG = /alamode/.test(process.env.NODE_DEBUG)

const catcher = (err) => {
  let stack
  let message
  if (err instanceof Error) {
    ({ stack, message } = err)
  } else {
    stack = message = err
  }
  DEBUG ? LOG(stack) : console.log(message)
  process.exit(1)
}

export default catcher
