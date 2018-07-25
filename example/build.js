/* build.js */
import alamode from '../src'

const src = 'src'
const output = 'build'

;(async () => {
  await alamode({
    src,
    output,
  })
})()