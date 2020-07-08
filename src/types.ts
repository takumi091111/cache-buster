import { HTMLElement } from 'node-html-parser'

export interface CommandProps {
  html: string
  watch?: string | ReadonlyArray<string>
}

export type ReplaceFunc = (
  element: HTMLElement,
  attrType: 'src' | 'href',
  srcUrl: string
) => HTMLElement | Promise<HTMLElement>
