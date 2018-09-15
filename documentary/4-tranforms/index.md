## .alamoderc.json

A transform can support options which can be set in the `.alamoderc.json` configuration file which is read from the same directory where the program is executed. Options inside of the `env` directive will be active only when the `ALAMODE_ENV` environmental variable is set to the `env` key.

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
  }
}
```

%~%

## Transforms

There are a number of built-in transforms, which don't need to be installed separately because their size is small enough to be included as direct dependencies.
