# React Router v6 で詰まったこと・学んだこと

## 1. `<Routes>` の子には `<Route>` しか置けない

### 詰まったこと

ルーティングをファイル分割しようとして、以下のように書いた。

```tsx
// HomeRoutes.tsx
export const HomeRoutes = () => {
  return (
    <Route path='/home' element={<Home />}>
      <Route path='setting' element={<Setting />} />
      <Route path='user_management' element={<UserManagement />} />
    </Route>
  )
}
```

```tsx
// Router.tsx
<Routes>
  <Route path="/" element={<Login />} />
  <HomeRoutes />
</Routes>
```

すると以下のエラーが発生した。

```
Error: [HomeRoutes] is not a <Route> component.
All component children of <Routes> must be a <Route> or <React.Fragment>
```

### 原因

React Router v6 の `<Routes>` は、**直接の子要素の型** をチェックしている。`<HomeRoutes />` は内部で `<Route>` を返していても、`<Routes>` から見ると「知らないコンポーネント」でしかない。

つまり、レンダリング結果ではなく **JSX ツリー上の直接の子要素の型** で判定されている。

### 解決策

`HomeRoutes` を関数コンポーネントではなく、`<Route>` 要素そのものを持つ変数に変更した。

```tsx
// HomeRoutes.tsx
export const HomeRoutes = (
  <Route path='/home' element={<Home />}>
    <Route index element={<HomeContent />} />
    <Route path='setting' element={<Setting />} />
    <Route path='user_management' element={<UserManagement />} />
  </Route>
)
```

```tsx
// Router.tsx
<Routes>
  <Route path="/" element={<Login />} />
  {HomeRoutes}
</Routes>
```

`{HomeRoutes}` で展開すると、`<Routes>` の中に `<Route>` が直接置かれるのと同じになるため、エラーが解消される。

---

## 2. 関数コンポーネントと変数の違い

今回の修正の本質は、`HomeRoutes` の中身を「関数」から「値」に変えたこと。

```tsx
// 関数が入っている → 呼び出さないと中身が出てこない
const HomeRoutes = () => (
  <Route path='/home' element={<Home />} />
)

// 値そのものが入っている → そのまま使える
const HomeRoutes = (
  <Route path='/home' element={<Home />} />
)
```

もっとシンプルな例で考えると：

```tsx
// 関数
const x = () => 5
x   // → 関数そのもの
x() // → 5

// 値
const y = 5
y   // → 5
```

どちらも `const` で宣言する変数だが、**中身が関数か値かが違う**。`() =>` があるかないかがその分かれ目になる。

---

## 3. index ルートでデフォルト表示を設定する

### 学んだこと

`<Route index>` は、**親ルートのパスにぴったり一致した時に表示される子ルート**。

```tsx
<Route path='/home' element={<Home />}>
  <Route index element={<HomeContent />} />
  <Route path='setting' element={<Setting />} />
  <Route path='user_management' element={<UserManagement />} />
</Route>
```

| URL | `<Outlet />` に表示される内容 |
|---|---|
| `/home` | `<HomeContent />` |
| `/home/setting` | `<Setting />` |
| `/home/user_management` | `<UserManagement />` |

`index` がないと、`/home` にアクセスした時に `<Home />` 内の `<Outlet />` 部分が空になる。`index` ルートはその空を埋めるデフォルトコンテンツという役割。

---

## 4. なぜ `<Routes>` は `<Route>` しか受け付けないのか

### 疑問

関数コンポーネントでも中で `<Route>` を返すなら、結果的に同じでは？なぜ `<Routes>` はそれを許さないのか。

### 答え：`<Routes>` は子をレンダリングせずに「データとして読む」から

通常のコンポーネント（`<div>` など）は、子コンポーネントを**レンダリングしてその結果**を使う。しかし `<Routes>` は違う。子の `<Route>` を**レンダリングせずに、props を設定データとして直接読み取る**。

```tsx
// Routes の内部処理のイメージ
function Routes({ children }) {
  React.Children.forEach(children, child => {
    // child.type が Route かどうかチェック
    if (child.type !== Route) {
      throw new Error("Route じゃないやつが混ざってる！")
    }
    // レンダリングせずに props を直接読む
    const path = child.props.path
    const element = child.props.element
  })
}
```

`<HomeRoutes />` を渡した場合、`child.type` は `HomeRoutes` 関数になる。`<Routes>` はこれをレンダリングしないので、中で `<Route>` を返すかどうかは知りようがない。だから「`Route` じゃない」とエラーになる。

### なぜこの設計なのか

URL マッチングは**全ルートを一括で比較して最適なものを選ぶ**必要がある。

もし子を一つずつレンダリングしてから判定する設計だと：

- 全コンポーネントを実行しないとどのルートが一致するかわからない
- 副作用のあるコンポーネントが意図せず実行される可能性がある

これを避けるため、`<Routes>` は「レンダリングせずに設定だけ読む」という設計を採用している。その制約として「`<Route>` 以外は受け付けない」というルールが存在する。
