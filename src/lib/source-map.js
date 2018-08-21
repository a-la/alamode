import { relative, resolve, join } from 'path'
import { appendFileSync, writeFileSync } from 'fs'
import { SourceMapGenerator } from 'source-map'
import { inlineCommentsRe, commentsRe } from '.'

const writeSourceMap = ({
  inputPath, relPath, output, name, source,
}) => {
  const file = join(relPath, name)
  const rel = relative(resolve(output, relPath), inputPath)
  const outputPath = resolve(output, file)

  const gen = new SourceMapGenerator({
    file,
  })
  const linesInSource = source
    .replace(commentsRe, (match, pos) => {
      const next = source[pos + match.length]
      if (next == '\n') return '\n'.repeat(match.split('\n').length - 1)

      const lines = match.split('\n')
      const lastLineI = lines.length - 1
      const lastLine = lines[lastLineI]
      const ss = ' '.repeat(lastLine.length)
      const ws = '\n'.repeat(lastLineI)
      return `${ws}${ss}`
    })
    .replace(inlineCommentsRe, (match) => {
      return ' '.repeat(match.length)
    })
    .split('\n')
  linesInSource.forEach((l, i) => {
    const line = i + 1
    l
      .replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (match, column) => {
        if (column == 0 && /^\s+$/.test(match)) return
        const pp = {
          line,
          column,
        }
        const m = {
          generated: pp,
          source: rel,
          original: pp,
        }
        gen.addMapping(m)
      })
  })
  gen.setSourceContent(rel, source)
  const sourceMap = gen.toString()
  const sourceMapName = `${name}.map`
  const comment = `\n//# sourceMappingURL=${sourceMapName}`
  const sourceMapFile = resolve(output, relPath, sourceMapName)
  appendFileSync(outputPath, comment)
  writeFileSync(sourceMapFile, sourceMap)
}

export default writeSourceMap