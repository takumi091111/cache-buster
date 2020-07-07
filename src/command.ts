import { resolve } from 'path'
import { parse } from 'node-html-parser'
import { appendTimeStamp } from '@/utils/append'
import { openFile, saveFile } from '@/utils/file'
import { watchGlob } from '@/utils/watch'
import { CommandProps } from '@/types'

const mainAction = async ({ html }: Omit<CommandProps, 'pattern'>) => {
  // コマンドを実行したディレクトリからの相対パス
  const filePath = resolve(process.cwd(), html)

  // HTMLファイルを開いて読み込む
  const content = await openFile(filePath)
  const element = parse(content)

  // 変更後に上書きする
  const newHtml = await appendTimeStamp(element)
  saveFile(filePath, newHtml)
}

export const action = async ({ html, watch }: CommandProps) => {
  if (watch === undefined) {
    mainAction({ html })
    console.info('✨ Update completed.')
    return
  }
  watchGlob(watch, (path) => {
    const cwd = process.cwd()
    const htmlPath = resolve(cwd, html)
    const targetPath = resolve(cwd, path)
    // htmlと同じファイルの更新は無視する(無限ループ対策)
    if (htmlPath === targetPath) return

    console.info('✨ Update completed. Watching for file changes: ', path)
    mainAction({ html })
  })
}
