import { constants } from 'os'
import { basename } from 'path'

console.log(basename(process.argv[1]))
console.log(constants.signals.SIGINT)