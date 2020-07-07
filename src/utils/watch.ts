import { Stats } from 'fs'
import { watch } from 'chokidar'

export const watchGlob = (
  paths: string | ReadonlyArray<string>,
  callback: (path: string, stats: Stats) => void
) => {
  return watch(paths, {
    alwaysStat: true
  }).on('change', (path, stats) => {
    if (stats === undefined) return

    const isChangeFile = stats.isFile
    if (!isChangeFile) return

    callback(path, stats)
  })
}
