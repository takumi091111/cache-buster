# cache-buster

## インストール

```sh
npm install https://github.com/takumi091111/cache-buster
```

## 使い方

```
Usage: cachebuster cache-buster --html <filepath>

Options:
  -h, --html [path]      書き換え対象のHTMLファイル
  -w, --watch [pattern]  監視対象のglobパターン
  -V, --version          output the version number
  --help                 display help for command
```

1. キャッシュを回避したいscriptタグやlinkタグに、data-bust-cache属性を付加します。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example</title>
  <script src="./main.js" data-bust-cache="true"></script>
  <link rel="stylesheet" href="./style.css" data-bust-cache="true">
</head>
<body>
  <p>Example</p>
</body>
</html>
```

2. ターミナルで以下のようにコマンドを実行すると、タグのURLにタイムスタンプが付加されます。

```sh
npx cachebuster --html ./dist/index.html
✨ Update completed.
```

```html
<script src="./main.js?_t=1594119507" data-bust-cache="true"></script>
<link rel="stylesheet" href="./style.css?_t=1594119507" data-bust-cache="true">
```

3. 特定のファイルが更新された際に自動で処理を行うことも可能です。

```sh
npx cachebuster --html ./dist/index.html --watch ./dist/*.js
✨ Update completed. Watching for file changes:  dist/index.js
```
