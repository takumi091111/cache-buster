import { resolve } from 'path'
import { MD5 } from 'object-hash'
import { openFile } from './file'

export const calcHash = async (
  basePath: string,
  url: string
) => {
  const path = resolve(basePath, url)
  const file = await openFile(path)
  return MD5(file)
}
