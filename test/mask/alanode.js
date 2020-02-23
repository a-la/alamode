import makeTestSuite from '@zoroaster/mask'
import Context from '../context'

export default
makeTestSuite('test/result/alanode', {
  fork: {
    module: Context.ALANODE,
    normaliseOutputs: true
  },
})