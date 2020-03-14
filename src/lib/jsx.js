import { join, dirname, relative, resolve } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { c } from 'erte'
import { read } from '@wrote/wrote'
import transpileJSX from '@a-la/jsx'
import { EOL } from 'os'

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
 * The path to the injector script in the output dir.
 * @type {?string}
 */
let injectorExists = null
const cssProcessed = {}

/**
 * Transpiles JSX and returns the string.
 * @param {string} file The path to the file.
 * @param {boolean|string} preact Whether to add preact pragma.
 * @param {string} output The path to the output dir. Needed for CSS injector.
 * @param {boolean} mod Whether writing a module.
 * @param {!_alamode.Config} alamodeConf The config.
 */
export const getJSX = async (file, preact, output, mod, alamodeConf) => {
  const source = await read(file)
  let transpiled = await transpileJSX(source, {
    quoteProps: 'dom',
    warn(message) {
      console.warn(c(message, 'yellow'))
      console.warn(c(' in %s', 'grey'), file)
    },
  })
  const { css: { classNames = {} } = {} } = alamodeConf
  transpiled = transpiled.replace(/^import(\s+{[^}]+?}\s+from)?\s+(['"])(.+?\.css)\2/gm, (m, named = '', q, p) => {
    try {
      if (!injectorExists) {
        const i = join(output, 'css-injector.js')
        const e = existsSync(i)
        if (!e) writeFileSync(i, `export default ${__$styleInject.toString()}`)
        injectorExists = i
      }
      const path = join(dirname(file), p)
      const cssJsName = `${p}.js`
      const cssOutput = join(output, cssJsName)

      if (!(cssOutput in cssProcessed)) {
        let rel = relative(dirname(cssOutput), injectorExists)
        if (!rel.startsWith('.')) rel = `./${rel}`
        const css = readFileSync(path)
        let s = `import __$styleInject from '${rel}'${EOL}${EOL}`
        s += `__$styleInject(\`${css}\`)`

        const r = join(p, '')
        const classNamesPath = classNames[r]
        if (classNamesPath) {
          const map = require(resolve(classNamesPath))
          const exp = Object.entries(map).map(([k, v]) => {
            return `export const $${k} = '${v}'`
          })
          s += `${EOL}${EOL}${exp.join(EOL)}`
          if (named) {
            let [, classes] = /{\s*([\s\S]+?)\s*}/.exec(named)
            classes = classes.split(/,/)
              .map(a => a.trim().replace(/^\$/, '')).filter(Boolean)
            classes.forEach((cl) => {
              if (!(cl in map)) {
                console.error('%s You\'re importing class %s from %s, which is not present in its map.', c('>', 'red'), c(`.${cl}`, 'red'), r)
                console.error('%s %s', c('>', 'red'), file)
              }
            })
            // debugger
          }
        }

        writeFileSync(cssOutput, s)
        cssProcessed[cssOutput] = true
        console.error('Added %s in %s', c(cssJsName, 'yellow'), file)
      }

      return `import${named} ${q}${p}${q}`
    } catch (err) {
      console.error('Could not include CSS in %s:\n%s', file, c(err.message, 'red'))
      return m
    }
  })
  if (preact) return `${mod ? `const { h } = requir`+`e('${preact}');` : `import { h } from '${preact}'`}
${transpiled}`
  return transpiled
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').Config} _alamode.Config
 */