const {
  Replaceable,
  makeMarkers, makeCutRule, makePasteRule,
} = require('restream')
let ALaImport = require('@a-la/import'); if (ALaImport && ALaImport.__esModule) ALaImport = ALaImport.default;
let ALaExport = require('@a-la/export'); if (ALaExport && ALaExport.__esModule) ALaExport = ALaExport.default;
let whichStream = require('which-stream'); if (whichStream && whichStream.__esModule) whichStream = whichStream.default;
let Catchment = require('catchment'); if (Catchment && Catchment.__esModule) Catchment = Catchment.default;
const { createReadStream } = require('fs')
const { commentsRe, inlineCommentsRe } = require('.')
const { getMap } = require('./source-map')
const { basename, dirname } = require('path');

const makeRules = () => {
  const { comments, inlineComments } = makeMarkers({
    comments: commentsRe,
    inlineComments: inlineCommentsRe,
    string: /'(.*)'/gm,
  })
  const mr = [comments, inlineComments]
  const [cutComments, cutInlineComments] = mr
    .map(makeCutRule)
  const [pasteComments, pasteInlineComments] = mr
    .map(makePasteRule)

  const rules = [
    cutComments,
    cutInlineComments,
    ...ALaImport,
    ...ALaExport,
    pasteInlineComments,
    pasteComments,
  ]
  return rules
}

const makeReplaceable = () => {
  const rules = makeRules()
  const replaceable = new Replaceable(rules)
  return replaceable
}

/**
 * Run a transform stream.
 */
       const transformStream = async ({
  source,
  destination,
}) => {
  const replaceable = makeReplaceable()

  const readable = createReadStream(source)

  readable.pipe(replaceable)
  const { promise: sourcePromise } = new Catchment({ rs: readable })

  const [,, sourceCode] = await Promise.all([
    whichStream({
      source,
      destination,
      readable: replaceable,
    }),
    new Promise((r, j) => {
      readable.once('error', j)
      replaceable.once('error', j)
      replaceable.once('end', r)
    }),
    sourcePromise,
  ])

  return sourceCode
}

class Context {
  constructor() {
    this.listeners = {}
  }
  on(event, listener) {
    this.listeners[event] = listener
  }
  emit(event, data) {
    this.listeners[event](data)
  }
}

/**
 * @param {string} source Source code as a string.
 */
       const syncTransform = (source, filename) => {
  const rules = makeRules()
  const context = new Context()

  const replaced = rules.reduce((acc, { re, replacement }) => {
    const newAcc = acc.replace(re, replacement.bind(context))
    return newAcc
  }, source)

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

module.exports.transformStream = transformStream
module.exports.syncTransform = syncTransform
//# sourceMappingURL=transform.js.map