
## Modes

Any block comments are stripped by default, to prevent issues such as detecting `import` and `export` statements inside of examples, e.g.,

%EXAMPLE: example/modes/comments.js%

However, this might backfire and prevent the program from being transpiled correctly when block comments are incorrectly deduced, e.g.,

%EXAMPLE: example/modes/comments-incorrect.js%

The above will not work because `/* */` is used to strip out comments before detecting template literals, and in the example it is included in 2 distinct template literals, so that the code with the `export` statement in-between is temporarily removed and does not participate in transforms.

The string which will reach the transforms therefore will be:

```js
const t = `https:%%_RESTREAM_INLINECOMMENTS_REPLACEMENT_0_%%
export { t2 }
```