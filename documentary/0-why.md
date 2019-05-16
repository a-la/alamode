## Why ÀLaMode

ÀLaMode is a neat, fast, low-weight alternative to AST-based transpilers. If you only want `import` and `export` statements, don't disrespect yourself by continuing to use _Babel_, and make a switch to **ÀLaMode** today. What am I talking about? Read next.

%~ width="25"%

### It's Neat

The source code is left pretty much intact, with line numbers preserved, and exports just being renamed to `module.export` while making sure to export the default module first if it is present. There is no need to come up with super-fancy solutions and try to build a rocket when all you need is a remote control. That means, don't worry about EcmaScript modules standard, it's significance is blown out of proportions by the "community" who has nothing better to do. Just rename <kbd>exports</kbd> to <kbd>module.exports</kbd> and <kbd>imports</kbd> to <kbd>require</kbd> &mdash; that's the philosophy behind _ÀLaMode_.

<table>
<tr><th>Source Code</th><th>Transpiled Code</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: node_modules/@a-la/fixture-alamode/src/class%
```


```
</td>
<td>

%EXAMPLE: node_modules/@a-la/fixture-alamode/build/class%
</td></tr>
</table>

<details>
<summary>Show Babel Output</summary>

%EXAMPLE: node_modules/@a-la/fixture-babel/build/class%
</details>

%~ width="25"%

### It Has 0 Dependencies

ÀLaMode does not install any additional dependencies, and it has been optimised with _Google Closure Compiler_. That means you don't have to wait ages for each new real dependency in your project to link with Babel's bloatware you don't care about. Just focus on the work and enjoy the single new directory in your `node_modules`.

<table>
<tr><th>ÀLaMode: 8 yarn.lock lines</th><th>Babel: 1650 yarn.lock Lines</th></tr>
<!-- block-start -->
<tr><td>
<img src="https://raw.githubusercontent.com/a-la/alamode/HEAD/doc/yarn-add-alamode.gif" alt="Installing ÀLaMode in 1 sec">
</td>
<td>
<img src="https://raw.githubusercontent.com/a-la/alamode/HEAD/doc/yarn-add-babel2.gif" alt="Linking Babel's Dependencies in 20 sec">
</td></tr>
</table>

%~ width="25"%

### It Respects JSDoc

Let's face it, _Babel_ is software for masses that has capitalized on people's vulnerability in wanting to use `import` and `export` statements which is one of the best features on the language. You say let them be, I say look what they are doing to your documented code without caring a single bit:

<table>
<tr><th>ÀLaMode: Gold Standard</th><th>Babel: JSDoc Enemy</th></tr>
<!-- block-start -->
<tr><td>
<img src="https://raw.githubusercontent.com/a-la/alamode/HEAD/doc/alamode.gif" alt="Correct JSDoc With ÀLaMode">
</td>
<td>
<img src="https://raw.githubusercontent.com/a-la/alamode/HEAD/doc/babel.gif" alt="Broken JSDoc With Babel">
</td></tr>
</table>

Original Source:

```js
/**
 * A function that returns `b`.
 * @param {number} times
 */
export const b = (times) => {
  return 'b' + (times ? `-${times}` : '')
}
```

See if you can figure out [why this happens](https://github.com/a-la/fixture-babel/blob/master/build/index.js#L31). Unlike _Babel_, our [Node.JS Development Company](https://artd.eco) cares about quality and developer experience, so we're offering ÀLaMode as a simple and lightweight solution to transpile packages.

<!-- To us, a [Node.JS Development Company](https://artd.eco) that puts developer experience and quality of software on the first place, it is a crime against all web software engineers to become a _JavaScript_ utility used by millions of people, and then destroy everyone's JSDoc just like that. It's not like they don't know about it, this bug has been filed with _Babel_, however 7 people ❤️ed the comment that "Babel is Open Source Software therefore it is allowed to have bugs" and none of them fixed it in over a year. No it's not allowed to have bugs like that. Please remove _Babel_ from all your computers, and spread the word about ÀLaMode using buttons below [please bear with me for the buttons]. -->

%~%

## Table Of Contents

%TOC%

%~%