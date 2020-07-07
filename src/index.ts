#!/usr/bin/env node
import { program } from 'commander'
import { action } from '@/command'

program
  .requiredOption('-h, --html [path]', '書き換え対象のHTMLファイル')
  .option('-w, --watch [pattern]', '監視対象のglobパターン', undefined)
  .usage('cache-buster --html <filepath>')
  .action(action)
  .version('0.0.1')

program.parse(process.argv)
