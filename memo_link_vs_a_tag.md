# `<a href>` vs React Router `<Link>` — ページ遷移でstateが消える問題

## 発生した問題

ログイン後、Homeコンポーネントでは `LoginUser` にユーザーデータが入っていた。
しかし、Headerのリンクをクリックして `/home/user_management` に遷移すると、`LoginUser` が `null` に戻ってしまった。

## 原因

Header.tsx のリンクが Chakra UI の `<Link href="...">` を使っていた。
これは内部的に HTML の `<a href="...">` タグになる。

```tsx
// ❌ 修正前：Chakra UIのLink（内部的に <a href> になる）
import { Link } from "@chakra-ui/react"

<Link href='/home/user_management'>ユーザー一覧</Link>
```

```tsx
// ✅ 修正後：React RouterのLink
import { Link } from "react-router-dom"

<Link to='/home/user_management'>ユーザー一覧</Link>
```

## なぜ `<a href>` だとstateが消えるのか

### ブラウザの通常の画面遷移（`<a href>`）

```
ユーザーがリンクをクリック
    ↓
ブラウザが新しいURLにHTTPリクエストを送る
    ↓
サーバーからHTMLを取得する
    ↓
ページ全体を最初から読み込み直す（フルリロード）
    ↓
JavaScriptも最初から実行し直す
    ↓
Reactアプリが最初から起動する
    ↓
useState の初期値（null）がセットされる
    ↓
★ ログイン時にsetLoginUserで入れたデータは消えている
```

これは、ブラウザのアドレスバーにURLを打ち込んで Enter を押すのと同じ動作。
ページ全体が破棄されて、一から作り直される。

### SPA（Single Page Application）の画面遷移（React Router の `<Link>`）

```
ユーザーがリンクをクリック
    ↓
React Router が <a> タグのデフォルト動作を preventDefault() で止める
    ↓
ブラウザにHTTPリクエストを送らせない（サーバーにアクセスしない）
    ↓
JavaScriptでURLだけを書き換える（History API を使用）
    ↓
React Router が新しいURLに対応するコンポーネントだけを差し替える
    ↓
ページ全体はリロードされない
    ↓
LoginUserProvider は生きたまま（アンマウントされない）
    ↓
★ useState のデータはそのまま保持される
```

## 図で比較

```
【<a href> の場合】

  ページ全体           ページ全体（新しく作り直し）
  ┌──────────┐        ┌──────────┐
  │ Provider │  全破棄  │ Provider │  ← useState は初期値(null)から
  │ ┌──────┐ │  ───→   │ ┌──────┐ │
  │ │ Home │ │        │ │ User │ │
  │ │      │ │        │ │ Mgmt │ │
  │ └──────┘ │        │ └──────┘ │
  └──────────┘        └──────────┘
  state: {id:1,...}    state: null  ← データ消えた！


【React Router <Link> の場合】

  ページ全体（そのまま生き続ける）
  ┌──────────────────────────┐
  │ Provider                 │  ← useState はそのまま保持
  │ ┌──────┐    ┌──────────┐ │
  │ │ Home │ →  │ UserMgmt │ │  ← この部分だけ差し替え
  │ └──────┘    └──────────┘ │
  └──────────────────────────┘
  state: {id:1,...}              ← データ残ってる！
```

## コンソールログでの見分け方

### フルリロードが起きている場合

遷移するたびにこのログが出る：

```
[vite] connecting...
[vite] connected.
```

これは Vite の開発サーバーとの WebSocket 接続が新しく確立されたことを意味する。
つまり、ページが最初から読み込み直されている。

### SPA遷移の場合

上記のログは出ない。
コンポーネントの差し替えだけが行われるので、React のログだけが出る。

## History API とは

React Router が内部で使っている、ブラウザ標準のAPI。

```javascript
// URLを変更するが、ページのリロードは発生しない
window.history.pushState({}, '', '/home/user_management')
```

通常、URLが変わるとブラウザはサーバーにリクエストを送ってページを読み込む。
しかし History API を使うと、URLだけを変更してページはそのままにできる。
React Router はこの仕組みを使って、SPA内の画面遷移を実現している。

## SPA（Single Page Application）とは

文字通り「単一ページのアプリケーション」。

- HTMLファイルは1つだけ（index.html）
- 最初のアクセス時にHTMLとJavaScript（React）をまとめて読み込む
- その後の画面遷移は、JavaScriptがコンポーネントを差し替えるだけ
- サーバーへの再アクセスは発生しない

これがSPAの「ページ遷移」の正体。実際にはページ遷移していない。
URLが変わってコンポーネントが切り替わるだけ。

## まとめ

| | `<a href>` | React Router `<Link>` |
|---|---|---|
| ページリロード | する | しない |
| useState のデータ | 消える | 残る |
| サーバーへのリクエスト | 発生する | 発生しない |
| 内部の仕組み | ブラウザのデフォルト動作 | History API + preventDefault |
| 使うべき場面 | 外部サイトへのリンク | アプリ内の画面遷移 |
