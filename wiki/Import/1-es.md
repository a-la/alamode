## esModule

The `if (dependency && dependency.__esModule) dependency = dependency.default;` check is there to make `alamode` compatible with _Babel_ and _TypeScript_ that export default modules as the `default` property of `module.exports` object and set the `__esModule` marker to true, e.g.,

```js
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = method;
```

The check will only be added for external modules, and the _Node.JS_ core dependencies as well as those that start with `.` or `/` will be required without the `__esModule` check. To enforce the check for any file, the `esCheck: always` should be set in the transform configuration. To disable the check for specific modules, they are added to the `alamodeModules` directive.

```json5
{
  "import": {
    "esCheck": "always", // adds the check for each default import
    "alamodeModules": ["restream"] // disables the check for packages
  }
}
```

If neither `esCheck` nor `alamodeModules` are present, _ÀLaMode_ will look up the _package.json_ of the module and see if it includes the `"alamode": true` property, and won't add the check if it does.

%~%