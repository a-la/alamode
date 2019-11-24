import { join } from 'path'
import { Replaceable, replace } from 'restream'
import { lstatSync } from 'fs'
import { readDirStructure, read, write } from '@wrote/wrote'

/**
 * @param {string} file
 */
const processFile = async (file) => {
  // here process
  const f = await read(file)
  const r = new Replaceable([
    {
      re: /^ *(?:var|let|const)\s+(\S+?)(\s*)=(\s*)require\((['"])(.+?)\4\)/gm,
      replacement(m, packageName, ws1, ws2, q, from) {
        return `import ${packageName}${ws1}from${ws2}${q}${from}${q}`
      },
    },
    {
      re: /^ *(?:var|let|const)(\s+{\s*)([\s\S]+?)(\s*})(\s*)=(\s*)require\((['"])(.+?)\6\)/gm,
      replacement(m, cws, packageName, cws2, ws1, ws2, q, from) {
        const pn = packageName.replace(/(\s*):(\s*)/g, (_, wws, wws1) => {
          return `${wws|| ' '}as${wws1 || ' '}`
        })
        return `import${cws}${pn}${cws2}${ws1}from${ws2}${q}${from}${q}`
      },
    },
  ])
  const res = await replace(r, f)
  await write(file, res)
}

/**
 * Process the directory.
 */
const processDir = async (conf) => {
  const { input, relPath = '.' } = conf
  const path = join(input, relPath)
  const { content } = await readDirStructure(path)
  const k = Object.keys(/** @type {!Object} */ (content))
  await k.reduce(async (acc, name) => {
    await acc
    const file = join(path, name)
    const { type } = content[name]
    if (type == 'File') {
      await processFile(file)
    } else if (type == 'Directory') {
      const newRelPath = join(relPath, name)
      await processDir({
        ...conf,
        relPath: newRelPath,
      })
    }
  }, {})
}

/**
 * Iterates through files and updates requires into imports.
 * @param {Object} conf
 * @param {string} conf.input
 */
export default async function refactor(conf) {
  const { input } = conf
  if (!input) throw new Error('Please specify the source file or directory to refactor.')

  const ls = lstatSync(input)
  if (ls.isDirectory()) {
    await processDir({ input })
  } else if (ls.isFile()) {
    await processFile(input)
  }
}