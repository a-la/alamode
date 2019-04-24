import { Replaceable } from 'restream'
import makeRules from '@a-la/markers'
import ALaImport from '@a-la/import'
import ALaExport from '@a-la/export'
import whichStream from 'which-stream'
import { collect } from 'catchment'
import { createReadStream } from 'fs'
import { basename, dirname, join } from 'path'
import { getMap } from './source-map'

/**
 * Reads the config from the cwd.
 * @return {!Object<string, !_alamode.Config>} The config from .alamoderc, or an empty object if it does not exist.
 */
const getConfig = () => {
  let config = {}
  try {
    const r = join(process.cwd(), '.alamoderc.json')
    config = require(r)
  } catch (err) {
    return config
  }
  const { env: { ALAMODE_ENV } } = process
  const { 'env': env } = config
  const c = (env && ALAMODE_ENV in env) ? env[ALAMODE_ENV] : config

  delete c['env']

  return c
}

const getRules = () => {
  const r = [
    ...ALaImport,
    ...ALaExport,
  ]
  const { rules, markers } = makeRules(r)
  return { rules, markers }
}

/**
 * The class to hold markers and config.
 * @implements {_alamode.ÀLaMode}
 */
export class ÀLaMode extends Replaceable {
  constructor() {
    const config = getConfig()
    const { rules, markers } = getRules()
    super(rules)

    this.markers = markers
    this.config = config
  }
}

/**
 * Run a transform stream, and return the source code that was transformed.
 */
export const transformStream = async ({
  source,
  destination,
  writable,
}) => {
  const alamode = new ÀLaMode()

  const readable = createReadStream(source)

  readable.pipe(alamode)
  readable.on('error', e => alamode.emit('error', e))

  const [, sourceCode] = await Promise.all([
    whichStream({
      source,
      ...(writable ? { writable } : { destination }),
      readable: alamode,
    }),
    collect(readable),
    new Promise((r, j) => alamode.on('finish', r).on('error', j)),
  ])
  return sourceCode
}

class Context {
  constructor(config, markers) {
    this.listeners = {}
    this.markers = markers
    this.config = config
  }
  on(event, listener) {
    this.listeners[event] = listener
  }
  emit(event, data) {
    this.listeners[event](data)
  }
}

export const transformString = (source) => {
  const config = getConfig()
  const { rules, markers } = getRules()
  const context = new Context(config, markers)

  const replaced = rules.reduce((acc, { re, replacement }) => {
    const newAcc = acc.replace(re, replacement.bind(context))
    return newAcc
  }, source)
  return replaced
}

/**
 * Transforms the code synchronously. Used in the `require` hook.
 * @param {string} source Source code as a string.
 * @param {string} filename The file name of the source.
 * @param {boolean} [noMap] Do not create source maps (used for JSX).
 */
export const syncTransform = (source, filename, noMap = false) => {
  const replaced = transformString(source)
  if (noMap) return replaced
  const file = basename(filename)
  const sourceRoot = dirname(filename)
  const map = getMap({
    originalSource: source,
    pathToSrc: file,
    sourceRoot,
  })
  const b64 = Buffer.from(map).toString('base64')
  const s = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${b64}`

  const code = `${replaced}\n${s}`

  return code
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').ÀLaMode} _alamode.ÀLaMode
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').Config} _alamode.Config
 */