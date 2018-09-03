import usually from 'usually'

export default () => {
  const usage = usually({
    usage: {
      source: `Location of the input to the transpiler,
either a directory or a file.`,
      '--output, -o': `Location to save results to. Passing "-"
will print to stdout when source is a file.`,
      '--help, -h': 'Display help information.',
      '--version, -v': 'Show version.',
      '--ignore, -i': `Paths to files to ignore, relative to the
source directory.`,
      '--noSourceMaps, -s': 'Don\'t generate source maps.',
      '--advanced, -a': `Attempt to skip statements inside of template
literals.`,
    },
    description: 'A tool to transpile JavaScript packages using regular expressions.',
    line: 'alamode source [-o destination]',
    example: 'alamode src -o build',
  })
  return usage
}