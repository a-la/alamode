import usually from 'usually'

const getUsage = (usage) => {
  const s = usually({
    usage,
    description: `A tool to transpile JavaScript packages using regular expressions.
Supports import/export and JSX transpilation.
https://artdecocode.com/alamode/`,
    line: 'alamode source [-o destination] [-i dir,file] [-s] [-jp]',
    example: 'alamode src -o build',
  })
  return s
}

export default getUsage