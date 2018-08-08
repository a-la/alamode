import method from './method'

export const libMethod = async () => {
  const t = await Promise.resolve('test')
  process.stdout.write(t)
  method()
}
