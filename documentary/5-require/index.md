## Require Hook

The purpose of the require hook is to be able to transpile files automatically when they are imported.

To use this feature, `alamode` needs to be `required` in a separate file, after which the `import` and `export` statements will become available.

For example, take the following directory structure, with a main and library files:

%TREE example/require%

<table>
<thead>
<tr>
<th><code>index.js</code></th>
<th><code>lib.js</code></th>
</tr>
</thead>
<tbody>
<tr/><tr>
<td>

%EXAMPLE: example/require%
</td>
<td>

%EXAMPLE: example/require/lib%
</td>
</tr>
</tbody>
</table>


The require hook would work in the following way:

%EXAMPLE: example/fake-require, ../.. => alamode%

By executing the `node require.js` command, `alamode` will be installed and it will do its job dynamically for every `.js` file that is required, enabling to use `import` and `export` statements.

%FORK example/require/require%

<!-- ### Options

A number of options can be passed as the argument to the `alamode` function.

%TYPEDEF types/register.xml%

```js
require('alamode') {
  cwd:
}
``` -->

%TYPEDEF types/Hook.xml%

%~ width="15"%

### Multiple Calls To Alamode()

When the call is made multiple times in the program, the latter calls will revert the previous hooks and install new ones. The warning will be shown unless the `noWarning` option is set to true.

%EXAMPLE: example/require/multiple, ../.. => alamode%

%_FORKERR example/require/multiple%

This can happen when the tests are set up to run with _Zoroaster_ with the `-a` flag for alamode, and the source code also tries to install the require hook.

%~%