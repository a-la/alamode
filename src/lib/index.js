import { join } from 'path'
import { chmodSync, lstatSync } from 'fs'

export const copyMode = (input, output) => {
  const ls = lstatSync(input)
  const { mode } = ls
  chmodSync(output, mode)
}

let _cached = null

/**
 * Reads the config from the cwd.
 * @return {!_alamode.Config} The config from .alamoderc, or an empty object if it does not exist.
 */
export const getConfig = (name = '.alamoderc.json') => {
  if (_cached) return _cached
  let config = {}
  try {
    const r = join(process.cwd(), name)
    config = require(r)
  } catch (err) {
    return config
  }
  const { env: { ALAMODE_ENV } } = process
  const { 'env': env } = config
  const c = (env && ALAMODE_ENV in env) ? env[ALAMODE_ENV] : config

  delete c['env']

  _cached = c
  return c
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').Config} _alamode.Config
 */