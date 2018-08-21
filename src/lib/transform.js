import {
  Replaceable,
  makeMarkers, makeCutRule, makePasteRule,
} from 'restream'
import ALaImport from '@a-la/import'
import ALaExport from '@a-la/export'
import whichStream from 'which-stream'
import Catchment from 'catchment'
import { createReadStream } from 'fs'
import { commentsRe, inlineCommentsRe } from '.'

const makeReplaceable = () => {
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

  const replaceable = new Replaceable([
    cutComments,
    cutInlineComments,
    ...ALaImport,
    ...ALaExport,
    pasteInlineComments,
    pasteComments,
  ])
  return replaceable
}

/**
 * Run a transform stream.
 */
export const transformStream = async ({
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
