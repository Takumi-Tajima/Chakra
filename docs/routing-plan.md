# ルーティング設定プラン

## Context
- React練習用プロジェクト。色々な実装パターンを学ぶことが目的
- Udemyの教材はReact Router v5ベース（`<Switch>`, `exact` prop を使う古い書き方）
- 現在のプロジェクトは React Router v7（`react-router-dom ^7.13.1`）を使用
- Home, Setting, UserManagement のページコンポーネントは作成済み、ルーター未統合

## Udemy（v5）と現在（v7）の対応関係

Udemyの教材で使われている書き方と、v7での対応を整理する：

| v5（Udemy）| v7（現在）| 補足 |
|---|---|---|
| `<Switch>` | `<Routes>` | 名前が変わっただけでなく、マッチングロジックも改善された |
| `exact: true/false` | 不要 | v7はデフォルトで完全一致。部分一致したい場合は `path="/home/*"` |
| `children: <Component />` | `element: <Component />` | prop名が `children` → `element` に変更 |
| `component={Component}` | `element: <Component />` | JSX要素を直接渡す形式に統一された |

## 実装パターンの比較（3パターン）

### パターンA: 配列 + map（Udemyパターンの現代版）★推奨
Udemyの教材と同じ発想を、v7の書き方に置き換えたもの。

**HomeRoutes.tsx:**
```tsx
import { Home } from "../components/pages/Home";
import { Setting } from "../components/pages/Setting";
import { UserManagement } from "../components/pages/UserManagement";

export const HomeRoutes = [
  { path: "/home", element: <Home /> },
  { path: "/home/setting", element: <Setting /> },
  { path: "/home/user_management", element: <UserManagement /> },
];
```

**Router.tsx:**
```tsx
import { Route, Routes } from "react-router-dom";
import { Login } from "../components/pages/Login";
import { HomeRoutes } from "./HomeRoutes";

export const Router = memo(() => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {HomeRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
});
```

- メリット: Udemyの教材との対比がわかりやすい。ルート追加が配列に1行足すだけ
- デメリット: ルート定義がデータなので、型安全性をちゃんとやるなら型定義が別途必要

---

### パターンB: useRoutes フック（データドリブンルーティング）
React Router v6+ で追加された、配列ベースのルーティングを公式サポートするフック。

**HomeRoutes.tsx:**
```tsx
import { Home } from "../components/pages/Home";
import { Setting } from "../components/pages/Setting";
import { UserManagement } from "../components/pages/UserManagement";
import type { RouteObject } from "react-router-dom";

export const homeRoutes: RouteObject[] = [
  { path: "/home", element: <Home /> },
  { path: "/home/setting", element: <Setting /> },
  { path: "/home/user_management", element: <UserManagement /> },
];
```

**Router.tsx:**
```tsx
import { useRoutes } from "react-router-dom";
import { Login } from "../components/pages/Login";
import { homeRoutes } from "./HomeRoutes";

export const Router = memo(() => {
  return useRoutes([
    { path: "/", element: <Login /> },
    ...homeRoutes,
  ]);
});
```

- メリット: `<Routes>` や `<Route>` のJSXが不要。`RouteObject` 型が公式提供されているため型安全。配列のスプレッドでルート統合できてスッキリ
- デメリット: `useRoutes` はReact Hookなので、memoとの組み合わせで注意が必要（戻り値がReactElement | null）

---

### パターンC: ネストルート + Outlet（レイアウト共有パターン）
/home 配下のページで共通UIを持たせたい場合の構造。今すぐは不要だが、知識として重要。

**HomeRoutes.tsx:**
```tsx
// この場合、Home がレイアウトコンポーネントになる
export const HomeRoutes = (
  <Route path="/home" element={<Home />}>
    <Route index element={<HomeContent />} />
    <Route path="setting" element={<Setting />} />
    <Route path="user_management" element={<UserManagement />} />
  </Route>
);
```

**Home.tsx（変更が必要）:**
```tsx
import { Outlet } from "react-router-dom";
export const Home = memo(() => {
  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />  {/* ← 子ルートのコンポーネントがここに描画される */}
    </>
  );
});
```

- メリット: ヘッダー・サイドバー等の共有レイアウトが自然に実現できる
- デメリット: 今の段階では共有UIがないので過剰。Home コンポーネントの役割がページ→レイアウトに変わってしまう

## 推奨: パターンA

理由：
1. Udemyの教材と同じ「配列 + map」の発想なので、教材との対比で学びやすい
2. `exact` や `<Switch>` が不要になった理由を体感できる
3. 各コンポーネントの変更が不要（最小限の変更）
4. 将来パターンCに移行する際も、Router.tsx の map 部分をネスト構造に書き換えるだけ

## 変更ファイル（2ファイルのみ）

1. `src/router/HomeRoutes.tsx` — 3ルートを配列で定義
2. `src/router/Router.tsx` — HomeRoutes を import して map 展開

## 検証方法
`npm run dev` で起動後、以下のURLにアクセス:
- `http://localhost:5173/` → Login
- `http://localhost:5173/home` → Home
- `http://localhost:5173/home/setting` → Setting
- `http://localhost:5173/home/user_management` → UserManagement
