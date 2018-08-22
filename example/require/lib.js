import { platform, arch } from 'os'

export default () => {
  return `${platform()}:${arch()}`
}