// refactors default module.export
module.exports = helloWorld;

/* expected */
export default helloWorld;
/**/

// refactors default export
exports = helloWorld;

/* expected */
export default helloWorld;
/**/

// refactors default function export
module.exports = function() {}

/* expected */
export default function() {}
/**/
