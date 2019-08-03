## .alamoderc.json

A transform can support options which are set in the `.alamoderc.json` configuration file. The configuration file is read from the same directory where the program is executed (cwd). Options inside of the `env` directive will be active only when the `ALAMODE_ENV` environmental variable is set to the `env` key.

```json
{
  "env": {
    "test-build": {
      "import": {
        "replacement": {
          "from": "^((../)+)src",
          "to": "$1build"
        }
      }
    }
  },
  "import": {
    "alamodeModules": ["alamode", "example"],
    "stdlib": {
      "path": "stdlib.js",
      "packages": ["example"]
    }
  }
}
```

%~%

## Transforms

The main import and export transforms are included as part of _ÀLaMode_.

- <kbd>📥[`@a-la/import`](../../wiki/Import)</kbd> Changes imports to requires. Read _Wiki_ for additional options and guidance on how to test builds and build source code to use the standard library compiled out of all dependencies using [_Depack_](https://github.com/dpck/depack#standard-library).
- <kbd>📤[`@a-la/export`](../../wiki/Export)</kbd> Updates `export` to `module.exports` while preserving whitespace for human-readable output.

%~%