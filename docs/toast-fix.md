# トースト通知が表示されない問題

## 問題

ログイン成功・失敗時にトースト通知が画面に表示されない。

## 原因

`createToaster()` が2箇所で**別々に呼び出されていた**ことが原因。

| ファイル | 役割 |
|---|---|
| `src/components/ui/toaster.tsx` | `createToaster()` でインスタンスAを生成 → `<Toaster />` コンポーネントで**描画**に使用 |
| `src/hooks/useMessage.ts` | `createToaster()` でインスタンスBを生成 → `.create()` でトーストを**発火**に使用 |

トーストを発火しているインスタンス(B)と、画面に描画しているインスタンス(A)が別物のため、発火しても画面には何も表示されなかった。

## 解決策

`useMessage.ts` で独自に `createToaster()` を呼ぶのをやめ、`toaster.tsx` から export されている `toaster` インスタンスを import して使用するように修正。

### 修正前（useMessage.ts）

```ts
import { createToaster } from "@chakra-ui/react"

const toaster = createToaster({
  placement: "top",
})
```

### 修正後（useMessage.ts）

```ts
import { toaster } from "@/components/ui/toaster"
```

これにより、発火と描画が同一のインスタンスを参照するようになり、トーストが正常に表示されるようになった。

## 教訓

`createToaster()` はアプリ全体で**1つのインスタンスだけ**を生成し、それを共有して使う必要がある。複数箇所で `createToaster()` を呼ぶと、それぞれが独立したインスタンスになるため連携しない。
