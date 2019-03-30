## ÀLaNode

To be able to spawn modules without having to create a proxy file as below:

```js
require('alamode')()
require('./package')
```

ÀLaMode bundles a binary called `alanode`. It will do the same thing as above, so that running modules with `import` and `export` statements becomes really easy.

```sh
$ alanode source
```

It changes `import` and `export` statements into `require` calls and `module.export` expressions. It also normalises `process.argv` to hide its presence, so that programs can safely keep using the _argv_ array without unexpected results.

_With the following file that uses an import_:

%EXAMPLE: test/fixture/t%

_`$ alanode t` will generate the result successfully:_

%FORK src/bin/alanode test/fixture/t%

<blockquote>

ÀLaNode is also available as a standalone package `alanode`.<br>
%NPM: alanode%
</blockquote>

%~%