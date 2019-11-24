/* eslint-disable semi */
const parseErr = 'test'

// refactors named assignment
exports.LOGGING = false;

/* expected */
export const LOGGING = false;
/**/

// refactors named export
exports.parseErr = parseErr;

/* expected */
export { parseErr };
/**/

// refactors named export with alias
exports.parse = parseErr

/* expected */
export const parse = parseErr
/**/

// refactors named function export
exports.some = (nodes, sel) => {
  return some(nodes, Array.isArray(sel) ? sel : parseSel(sel));
};

/* expected */
export const some = (nodes, sel) => {
  return some(nodes, Array.isArray(sel) ? sel : parseSel(sel));
};
/**/
