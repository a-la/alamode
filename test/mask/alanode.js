import makeTestSuite from '@zoroaster/mask'
import { homedir } from 'os'
import Context from '../context'

export default
makeTestSuite('test/result/alanode', {
  fork: {
    module: Context.ALANODE,
    preprocess: {
      stdout(stdout) {
        return stdout
          .replace(`node/${process.version}/bin/node`,
            `node/v8.15.0/bin/node`)
          .replace(new RegExp(homedir(), 'g'), '')
      },
    },
  },
})