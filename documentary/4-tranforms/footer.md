
### Advanced Mode

Advanced mode is required when there are template strings inside of which `import` and `export` statements are found. To prevent them from participating in the transforms, `alamode` will cut them out first to stop transform regexes detecting statements inside of template literals, and then paste them back.

%EXAMPLE: example/advanced.js%

Without the advanced mode:

%FORK-js src/bin/alamode example/advanced.js%

With the advanced mode:

%FORK-js src/bin/alamode example/advanced.js -a%

However, this option is not perfect, and



If it was the other way around (with template literals being detected first), e.g.,

```js
const bool = false
const url = 'test'
/* A path to an example ` */
const t = 'https://example.com'
export const t
/* A path to the test ` */
const t2 = 'https://test.org'
```

there still would be a problem, as the same logic would apply to stripping everything between 2 \`s. This shows that `alamode` is not very robust because it does not build an AST, and can work for many simpler cases. Most of the time, there would be no need to write `export` and `import` statements in the template literals where they receive a dedicated line.