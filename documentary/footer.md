## Troubleshooting

Because there can be many intricacies when transpiling with regular expressions, problems might arise from time to time. If using the `require` hook, the best solution is to build the source code using `alamode` binary, and see where the error occurs. Then it must be analysed why it happens, for example:

- The `import` or `export` transform does not match the case.
- A portion of source code is cut out before the transform with [`markers`](https://github.com/a-la/markers/blob/master/src/index.js#L46) so that the line does not participate in a transform.

So the single most common problem that we've experienced, is using the `//` and `/*` inside string literals (<code>`</code>), e.g.,

%EXAMPLE: example/trouble%
%/FORKERR example/trouble%

This is because <code>//${host}:${port}`</code> will be cut until the end of the line as a comment prior to the template, and the template will match until the next opening backtick rather than the correct one, taking out the <code>export</code> from the transformation. To validate that, we can run the <code>alamode src -d</code> command:

%/FORK src/bin/alamode example/trouble.js -d%

Now to fix this issue, either use `'` to concatenate strings that have `/*` and `//`, or use `import { format } from 'url'` to dynamically create addresses.

<!-- Currently not supported:

- `import 'package'` -->

%~%

<!-- ## TODO

- [ ] Allow to erase the build directory before the build so that old files are removed.
- [ ] Implement JSX transform.
- [ ] Dynamic mode when code is evaluated to find when transforms are required (target). -->

## Copyright & License

GNU Affero General Public License v3.0

You CAN use the require hook for your own code without publishing the source code. For example, you CAN run a web-server where your source code is transpiled on-the-fly. On the other hand, you're not allowed to build other software packages that link to _ÀLaMode_ to enable transpilation feature for your users without adhering to **Affero**.

Affero is better for Open Source anyway, why don't you consider it instead of MIT.

<alamode-footer />

%~ -1%