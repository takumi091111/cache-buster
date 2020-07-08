import { resolve } from 'path'
import { parse } from 'node-html-parser'
import { appendTimeStamp } from '@/utils/append'
import { openFile, saveFile } from '@/utils/file'
import { watchGlob } from '@/utils/watch'
import { CommandProps } from '@/types'

// コマンドを実行したディレクトリ
const cwd = process.cwd()

const processFile = async (htmlPath: string) => {
  // HTMLファイルを開いて読み込む
  const content = await openFile(htmlPath)
  const element = parse(content)

  // 変更後に上書きする
  const newHtml = await appendTimeStamp(element)
  saveFile(htmlPath, newHtml)
}

export const action = async ({ html, watch }: CommandProps) => {
  const htmlPath = resolve(cwd, html)

  if (watch === undefined) {
    processFile(htmlPath)
    console.info('✨  Process completed.')
    return
  }

  watchGlob(watch, (path) => {
    const targetPath = resolve(cwd, path)
    // htmlの更新は無視する(無限ループ対策)
    if (htmlPath === targetPath) return

    processFile(htmlPath)
    console.info('✨  Process completed. File changes detected:', path)
  })
}
