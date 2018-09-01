
## Troubleshooting

Because there can be many intricacies when transpiling with regular expressions, problems might arise from time to time. If using the `require` hook, the best solution is to build the source code using `alamode` binary, and see where the error occurs. Then it must be analysed why it happens, for example:

- The `import` or `export` transform does not match the case.
- A portion of source code is cut out before the transform with [`markers`](https://github.com/a-la/markers/blob/master/src/index.js#L46) so that the line does not participate in a transform.

## Copyright

(c) [À La Mode][1] 2018

[1]: https://alamode.cc
