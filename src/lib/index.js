import { chmodSync, lstatSync } from 'fs'

export const copyMode = (input, output) => {
  const ls = lstatSync(input)
  const { mode } = ls
  chmodSync(output, mode)
}