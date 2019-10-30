import { join, dirname, relative } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { c } from 'erte'
import { read } from '@wrote/wrote'
import transpileJSX from '@a-la/jsx'

function __$styleInject(css = '') {
  try { if (!document) return } catch (err) { return }
  const head = document.head
  const style = document.createElement('style')
  style.type = 'text/css'
  if (style.styleSheet){
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  head.appendChild(style)
}

/**
 * Transpiles JSX and returns the string.
 * @param {string} file The path to the file.
 * @param {boolean} preact Whether to add preact pragma.
 * @param {string} output The path to the output dir. Needed for CSS injector.
 */
export const getJSX = async (file, preact, output) => {
  const source = await read(file)
  let transpiled = await transpileJSX(source, {
    quoteProps: 'dom',
    warn(message) {
      console.warn(c(message, 'yellow'))
      console.warn(c(' in %s', 'grey'), file)
    },
  })
  transpiled = transpiled.replace(/^import (['"])(.+?\.css)\1/gm, (m, q, p) => {
    try {
      const i = join(output, 'css-injector.js')
      const e = existsSync(i)
      if (!e) writeFileSync(i, `export default ${__$styleInject.toString()}`)
      const path = join(dirname(file), p)
      const cssJsName = `${p}.js`
      const cssOutput = join(output, cssJsName)

      let rel = relative(dirname(cssOutput), i)
      if (!rel.startsWith('.')) rel = `./${rel}`
      const css = readFileSync(path)
      let s = `import __$styleInject from '${rel}'\n\n`
      s += `__$styleInject(\`${css}\`)`

      writeFileSync(cssOutput, s)
      console.error('Added %s in %s', c(cssJsName, 'yellow'), file)
      return `import ${q}${cssJsName}${q}`
    } catch (err) {
      console.error('Could not include CSS in %s:\n%s', file, c(err.message, 'red'))
      return m
    }
  })
  if (preact) return `import { h } from 'preact'
${transpiled}`
  return transpiled
}
