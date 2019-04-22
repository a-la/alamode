import { relative, join } from 'path'
import { appendFileSync, writeFileSync } from 'fs'
import SourceMapGenerator from '@a-la/source-map-generator'
import { inlineCommentsRe, commentsRe } from '@a-la/markers'

/**
 * @param {Object} conf
 * @param {string} [conf.file] The filename of the generated source.
 * @param {string} [conf.originalSource] The content of the source file.
 * @param {string} [conf.pathToSrc] The source file
 * @param {string} [conf.sourceRoot] A root for all relative URLs in this source map.
 */
export const getMap = ({
  file,
  originalSource: original,
  pathToSrc: source,
  sourceRoot,
}) => {
  const gen = new SourceMapGenerator({
    file,
    sourceRoot,
  })
  const linesInSource = original
    .replace(commentsRe, (match, pos) => {
      const next = original[pos + match.length]
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
        const generated = {
          line,
          column,
        }
        const m = {
          generated,
          source,
          original: generated,
        }
        gen.addMapping(m)
      })
  })
  gen.setSourceContent(source, original)
  const sourceMap = gen.toString()
  return sourceMap
}

export default function addSourceMap({
  source, outputDir, name, destination, file, originalSource,
}) {
  const pathToSrc = relative(outputDir, source)

  const map = getMap({
    file, originalSource, pathToSrc,
  })

  const sourceMapName = `${name}.map`
  const comment = `\n//# sourceMappingURL=${sourceMapName}`
  appendFileSync(destination, comment)

  const sourceMapPath = join(outputDir, sourceMapName)
  writeFileSync(sourceMapPath, map)
}