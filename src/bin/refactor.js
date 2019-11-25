import { Replaceable, replace } from 'restream'
import { lstatSync } from 'fs'
import readDirStructure, { getFiles } from '@wrote/read-dir-structure'
import { read, write } from '@wrote/wrote'

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
    {
      re: /^( *)(?:module\.)?exports\s*=/gm,
      replacement(m, ws) {
        return `${ws}export default`
      },
    },
    {
      re: /^( *)(?:module\.)?exports\.(\S+?)\s*=\s*([^\s;]+)/gm,
      replacement(m, ws, name, what) {
        if (name == what) {
          return `${ws}export { ${name} }`
        }
        return `${ws}export const ${name} = ${what}`
      },
    },
  ])
  const res = await replace(r, f)
  await write(file, res)
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
    const { content } = await readDirStructure(input)
    const f = getFiles(content, input)
    await Promise.all(f.map(async p => {
      await processFile(p)
    }))
  } else if (ls.isFile()) {
    await processFile(input)
  }
}