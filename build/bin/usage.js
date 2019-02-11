let usually = require('usually'); if (usually && usually.__esModule) usually = usually.default;

const getUsage = () => {
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
      '--jsx, -j': 'Transpile a JSX but keep modules.',
      '--preact, -p': 'Add Preact pragma ({ h }) for JSX.',
    },
    description: 'A tool to transpile JavaScript packages using regular expressions.',
    line: 'alamode source [-o destination]',
    example: 'alamode src -o build',
  })
  return usage
}

module.exports=getUsage