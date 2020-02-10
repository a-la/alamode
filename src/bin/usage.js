import usually from 'usually'
import { c } from 'erte'
import { reduceUsage } from 'argufy'
import { argsConfig, argsConfigJSX } from './get-args'

const getUsage = () => {
  const usage = reduceUsage(argsConfig)
  const s = usually({
    usage,
    description: c('ÀLaMode', 'red') + `\nA tool to transpile JavaScript packages using regular expressions.
Supports import/export and JSX transpilation.
https://artdecocode.com/alamode/`,
    line: 'alamode source [-o destination] [-i dir,file] [--env env] [-s]',
    example: 'alamode src -o build -s',
  })
  console.log(s)
  const s2 = usually({
    usage: reduceUsage(argsConfigJSX),
    description: c('JSX transpilation', 'magenta') + `\nAllows to transpile JSX using RegExes.`,
    line: 'alamode source [-o destination] -j [-mpE]',
    example: 'alamode src -o build -j -m',
  })
  console.log(s2)
}

export default getUsage