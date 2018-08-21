const { chmodSync, lstatSync } = require('fs')

       const copyMode = (input, output) => {
  const ls = lstatSync(input)
  const { mode } = ls
  chmodSync(output, mode)
}

       const commentsRe =  /\/\*(?:[\s\S]+?)\*\//g
       const inlineCommentsRe = /\/\/(.+)/gm

module.exports.copyMode = copyMode
module.exports.commentsRe = commentsRe
module.exports.inlineCommentsRe = inlineCommentsRe
//# sourceMappingURL=index.js.map