import { readFile, writeFile } from 'fs/promises'

export const openFile = async (path: string) => {
  const content = await readFile(path, {
    encoding: 'utf-8',
    flag: 'r'
  }).catch(err => {
    throw new Error(err)
  })
  return content
}

export const saveFile = async (path: string, content: string) => {
  writeFile(path, content, {
    encoding: 'utf-8',
    flag: 'w'
  }).catch(err => {
    throw new Error(err)
  })
}
