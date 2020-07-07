import URI from 'urijs'
import { HTMLElement } from 'node-html-parser'
import { calcHash } from './hash'

const getTimeStamp = () => {
  return Math.floor(Date.now() / 1000)
}

const replaceElementsURL = async (
  html: HTMLElement,
  replaceFunc: (
    element: HTMLElement,
    attrType: 'src' | 'href',
    srcUrl: string
  ) => HTMLElement | Promise<HTMLElement>
) => {
  // data-bust-cache属性がtrueの要素を取得
  const elements = html.querySelectorAll('[data-bust-cache="true"]')

  // 書き換え済み要素
  const newElements = elements.map(async element => {
    const hasSrc = element.hasAttribute('src')
    const hasHref = element.hasAttribute('href')
    const hasAnyAttribute = hasSrc || hasHref

    // src属性とhref属性、どちらも存在しない場合は処理しない
    if (!hasAnyAttribute) return element

    // 要素のURL
    const srcUrl = element.getAttribute('src') || element.getAttribute('href')
    if (srcUrl === undefined) return element

    // 要素の種類
    const attrType = hasSrc ? 'src' : 'href'

    return replaceFunc(element, attrType, srcUrl)
  })

  // 元の要素と書き換え済み要素を入れ替え
  for (let i = 0; i < elements.length; i++) {
    html.exchangeChild(elements[i], await newElements[i])
  }

  return html
}

const appendQueryParam = (
  element: HTMLElement,
  attrType: 'src' | 'href',
  srcUrl: string,
  paramName: string,
  value: string
) => {
  // URLにクエリパラメータを付加する
  const url = new URI(srcUrl)
    .removeQuery(paramName)
    .addQuery(paramName, value)
  
  // URLを上書きする
  if (attrType === 'src') {
    element.setAttribute('src', url.toString())
  } else if (attrType === 'href') {
    element.setAttribute('href', url.toString())
  }

  // data属性を追加する
  element.setAttribute('data-bust-cache', 'true')

  return element
}

export const appendTimeStamp = async (element: HTMLElement) => {
  const _element = await replaceElementsURL(element, (elem, attrType, srcUrl) => {
    // クエリパラメータのキーと値
    const key = '_t'
    const value = getTimeStamp().toString()
    return appendQueryParam(elem, attrType, srcUrl, key, value)
  })
  return _element.toString()
}

export const appendMD5Hash = async (
  basePath: string,
  element: HTMLElement
) => {
  const _element = await replaceElementsURL(element, async (elem, attrType, srcUrl) => {
    const hash = await calcHash(basePath, srcUrl)
    // クエリパラメータのキーと値
    const key = '_h'
    const value = hash.toString()
    return appendQueryParam(elem, attrType, srcUrl, key, value)
  })
  return _element.toString()
}
