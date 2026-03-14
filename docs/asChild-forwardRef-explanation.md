# asChild と forwardRef の解説

## 問題

`Dialog.Trigger`に`asChild`を付けて、自作の`UserCard`コンポーネントをトリガーとして指定したが、クリックしてもダイアログが開かなかった。

```tsx
<Dialog.Trigger asChild>
  <UserCard imageUrl={imageUrl} userName={userName} fullName={fullName} />
</Dialog.Trigger>
```

## 原因

`asChild`を使うと、`Dialog.Trigger`は自身のDOM要素を描画せず、子コンポーネントに以下のpropsを渡してトリガーの役割を委譲する。

| 渡されるもの | 用途 |
|---|---|
| `ref` | Chakra UIが内部でDOM要素を参照するため |
| `onClick` | ダイアログの開閉を制御するため |
| `aria-*`属性 | アクセシビリティのため |

しかし、修正前の`UserCard`はこれらを一切受け取っていなかった。

```tsx
// 修正前: ref も ...rest も受け取っていない
export const UserCard = ({ imageUrl, userName, fullName }: UserInfo) => {
  return(
    <Box ...>  {/* ← ref も onClick も渡されていない */}
```

結果として、Chakra UIが渡す`ref`と`onClick`が全て捨てられ、ダイアログが開かなかった。

---

## forwardRef とは（React 18以前）

React 18以前では、関数コンポーネントは通常`ref`を受け取ることができなかった。
`forwardRef`は、**親から渡された`ref`を子コンポーネント内のDOM要素に転送（forward）する**ための仕組み。

### forwardRefなしの場合（React 18以前）

```tsx
const MyComponent = (props) => {
  return <div>Hello</div>
}

// 親がrefを渡しても…
<MyComponent ref={someRef} />
// → someRef は div に到達しない。refは捨てられる。
```

### forwardRefありの場合（React 18以前）

```tsx
const MyComponent = forwardRef((props, ref) => {
  //                                   ^^^ 第2引数でrefを受け取れるようになる
  return <div ref={ref}>Hello</div>
  //          ^^^^^^^^ DOM要素にrefを渡す
})

// 親がrefを渡すと…
<MyComponent ref={someRef} />
// → someRef.current === <div>Hello</div> （DOM要素を参照できる）
```

通常のpropsとは別に、**第2引数として`ref`を受け取れるようにする**のが`forwardRef`の役割だった。

---

## React 19 での変更: forwardRef は不要に

React 19からは`ref`が**普通のpropsとして渡せるようになった**ため、`forwardRef`は不要になった。

### React 18以前（forwardRefが必要）

```tsx
import { forwardRef } from "react"

const MyComponent = forwardRef<HTMLDivElement, MyProps>(
  (props, ref) => {
    return <div ref={ref}>Hello</div>
  }
)
```

### React 19以降（forwardRef不要）

```tsx
// forwardRef なし。ref を普通のpropsとして受け取るだけ
const MyComponent = ({ ref, ...props }: MyProps & { ref?: Ref<HTMLDivElement> }) => {
  return <div ref={ref}>Hello</div>
}
```

`ref`がもはや特別扱いされず、`onClick`や`className`と同じ普通のpropになった。
これにより`forwardRef`のボイラープレートが不要になり、コードがシンプルになる。

### 型の指定方法の違い

| | React 18以前 | React 19以降 |
|---|---|---|
| 書き方 | `forwardRef<HTMLDivElement, Props>(...)` | `{ ref?: Ref<HTMLDivElement> }` をpropsの型に含める |
| refの受け取り方 | 第2引数 `(props, ref)` | propsの一部 `({ ref, ...rest })` |
| import | `import { forwardRef } from "react"` | `import type { Ref } from "react"` （型のみ） |

---

## ref

`ref`はReactの特殊な属性で、**レンダリング結果のDOM要素への参照**を保持するもの。

### Chakra UIが ref を必要とする理由

```
Dialog.Trigger (asChild)
  └── ref を渡す ──→ UserCard ──→ Box (<div>)
                                    ↑
                          Chakra UIはこのDOM要素を掴みたい
                          （位置計算、フォーカス管理、イベント制御に必要）
```

`asChild`の場合、`Dialog.Trigger`自身はDOMに何も描画しないため、子コンポーネントのDOM要素を`ref`で掴む必要がある。`ref`が転送されないと、Chakra UIは制御対象のDOM要素を見つけられない。

---

## `...rest`（残余プロパティ）

### 構文の意味

```tsx
({ imageUrl, userName, fullName, ...rest }, ref) => {
//  ^^^^^^^^  ^^^^^^^^  ^^^^^^^^  ^^^^^^
//  個別に取り出す3つ             それ以外の全propsをまとめた1つのオブジェクト
```

分割代入で明示的に取り出したもの以外の**全てのプロパティ**が`rest`に入る。

### 具体例

Chakra UIが以下のpropsを渡してくるとする：

```tsx
// Dialog.Trigger が実際に渡すpropsのイメージ
{
  imageUrl: "...",
  userName: "Taro",
  fullName: "Yamada Taro",
  onClick: () => { /* ダイアログを開く */ },
  "aria-expanded": false,
  "data-state": "closed"
}
```

分割代入の結果：

```
imageUrl  = "..."
userName  = "Taro"
fullName  = "Yamada Taro"
rest      = {
  onClick: () => { /* ダイアログを開く */ },
  "aria-expanded": false,
  "data-state": "closed"
}
```

### なぜ `{...rest}` を Box に展開するのか

```tsx
<Box ref={ref} {...rest} ...>
//             ^^^^^^^^^
//             rest の中身を全て Box のpropsとして展開する
```

こうすることで、Chakra UIが渡す`onClick`やaria属性などが全てルートの`Box`（`<div>`）に適用される。
これをしないと、`onClick`がどのDOM要素にも付かず、クリックしてもイベントが発火しない。

---

## 修正前後の比較

### 修正前

```tsx
export const UserCard = ({ imageUrl, userName, fullName }: UserInfo) => {
  return(
    <Box w="260px" ...>
```

- `ref`: 受け取れない → Chakra UIがDOM要素を参照できない
- `onClick`等: 受け取れない → クリックしても何も起きない

### 修正後（React 19方式）

```tsx
export const UserCard = ({ imageUrl, userName, fullName, ref, ...rest }: UserCardProps) => {
  return(
    <Box ref={ref} {...rest} w="260px" ...>
```

- `ref`: 普通のpropsとして受け取り → `Box`に転送 → Chakra UIがDOM要素を参照できる
- `onClick`等: `...rest`で受け取り → `Box`に展開 → クリックでダイアログが開く
- `forwardRef`は不要（React 19では`ref`が普通のprop）

---

## FAQ: ref や ...rest は誰が渡しているのか？

### 疑問

`UserDialog`から`UserCard`を呼び出すとき、`ref`や`...rest`に相当するpropsを明示的に書いていない。これで問題ないのか？

```tsx
// UserDialog.tsx — ref も onClick も書いていない
<Dialog.Trigger asChild>
  <UserCard imageUrl={imageUrl} userName={userName} fullName={fullName} />
</Dialog.Trigger>
```

### 答え: asChild が内部で自動的に追加する

`asChild`を付けると、`Dialog.Trigger`は自身のDOM要素を描画せず、Chakra UIの内部処理で子コンポーネントに追加のpropsをマージする。

自分が書いたコードと、Chakra UIが内部で実際に渡すpropsのイメージ：

```tsx
// 自分が書いたのはこれだけ
<UserCard imageUrl={imageUrl} userName={userName} fullName={fullName} />

// しかし asChild により、Chakra UIが内部で以下のようにpropsを追加する（イメージ）
<UserCard
  imageUrl={imageUrl}       // ← 自分が書いた
  userName={userName}       // ← 自分が書いた
  fullName={fullName}       // ← 自分が書いた
  ref={triggerRef}          // ← Dialog.Trigger が自動で追加
  onClick={openDialog}      // ← Dialog.Trigger が自動で追加
  aria-expanded={isOpen}    // ← Dialog.Trigger が自動で追加
  data-state="closed"       // ← Dialog.Trigger が自動で追加
/>
```

### UserCard側での受け取り

```tsx
({ imageUrl, userName, fullName, ref, ...rest }: UserCardProps) => {
//  ↑自分が書いた3つ              ↑自動追加  ↑自動追加（onClick, aria-* 等が全部入る）
```

- `ref` → `Dialog.Trigger`が自動で渡す → `UserCard`の`ref`引数に入る
- `onClick`, `aria-*`等 → `Dialog.Trigger`が自動で渡す → `...rest`にまとめて入る

自分で明示的に書く必要はない。`asChild`の仕組みが裏でやってくれる。
だからこそ`...rest`で「何が来るか分からないが全部受け取る」書き方が必要になる。

---

## 参考

- [Chakra UI - Composition](https://chakra-ui.com/docs/components/concepts/composition)
- [Chakra UI - Migration to v3](https://chakra-ui.com/docs/get-started/migration)
- [React - forwardRef（日本語）](https://ja.react.dev/reference/react/forwardRef) — React 19で非推奨
