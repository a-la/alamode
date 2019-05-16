import { join } from 'path'
import { chmodSync, lstatSync } from 'fs'

export const copyMode = (input, output) => {
  const ls = lstatSync(input)
  const { mode } = ls
  chmodSync(output, mode)
}

/**
 * Reads the config from the cwd.
 * @return {!Object<string, !_alamode.Config>} The config from .alamoderc, or an empty object if it does not exist.
 */
export const getConfig = () => {
  let config = {}
  try {
    const r = join(process.cwd(), '.alamoderc.json')
    config = require(r)
  } catch (err) {
    return config
  }
  const { env: { ALAMODE_ENV } } = process
  const { 'env': env } = config
  const c = (env && ALAMODE_ENV in env) ? env[ALAMODE_ENV] : config

  delete c['env']

  return c
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').Config} _alamode.Config
 */