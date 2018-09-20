const { Replaceable } = require('restream');
let makeRules = require('@a-la/markers'); if (makeRules && makeRules.__esModule) makeRules = makeRules.default;
let ALaImport = require('@a-la/import'); if (ALaImport && ALaImport.__esModule) ALaImport = ALaImport.default;
let ALaExport = require('@a-la/export'); if (ALaExport && ALaExport.__esModule) ALaExport = ALaExport.default;
let whichStream = require('which-stream'); if (whichStream && whichStream.__esModule) whichStream = whichStream.default;
const { collect } = require('catchment');
const { createReadStream } = require('fs');
const { basename, dirname, join } = require('path');
const { getMap } = require('./source-map');

const getConfig = () => {
  let config = {}
  try {
    const r = join(process.cwd(), '.alamoderc.json')
    config = require(r)
  } catch (err) {
    return config
  }
  const { env: { ALAMODE_ENV } } = process
  const c = config.env && ALAMODE_ENV in config.env ? config.env[ALAMODE_ENV] : config

  delete c.env

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

       class ALaMode extends Replaceable {
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
       const transformStream = async ({
  source,
  destination,
  writable,
}) => {
  const alamode = new ALaMode()

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

       const transformString = (source) => {
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
 * @param {string} source Source code as a string.
 */
       const syncTransform = (source, filename, advanced) => {
  const replaced = transformString(source, advanced)
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

module.exports.ALaMode = ALaMode
module.exports.transformStream = transformStream
module.exports.transformString = transformString
module.exports.syncTransform = syncTransform
//# sourceMappingURL=transform.js.map