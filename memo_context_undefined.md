# Contextのundefinedチェックが必要な理由

## 発生したエラー

```
プロパティ 'setLoginUser' は型 'LoginUserContextType | undefined' に存在しません。ts(2339)
```

## エラーが出たときのコード

### LoginUserProvider.tsx（Context作成側）

```tsx
import { createContext, useState } from 'react';
import type { User } from '../types/api/user';

export type LoginUserContextType = {
  LoginUser: User | null
  setLoginUser: (user: User) => void
}

// ★ ここでContextの中身の型を「LoginUserContextType | undefined」と指定している
// ★ 初期値は undefined
export const LoginUserContext = createContext<LoginUserContextType | undefined>(undefined);

export const LoginUserProvider = (props: { children: React.ReactNode }) => {
  const { children } = props
  const [LoginUser, setLoginUser] = useState<User | null>(null);

  return (
    <LoginUserContext.Provider value={{ LoginUser, setLoginUser }}>
      {children}
    </LoginUserContext.Provider>
  );
};
```

### useLoginUser.ts（カスタムフック・修正前）

```tsx
import { useContext } from "react";
import { LoginUserContext } from "../providers/LoginUserProvider";
import type { LoginUserContextType } from "../providers/LoginUserProvider";

// ★ 返り値の型が「LoginUserContextType | undefined」
export const useLoginUser = (): LoginUserContextType | undefined => {
  return useContext(LoginUserContext);
};
```

### useAuth.ts（カスタムフックの呼び出し側）

```tsx
export const useAuth = () => {
  // ★ ここでエラーが出る
  // useLoginUser()の返り値が「LoginUserContextType | undefined」なので
  // undefinedの可能性がある値から .setLoginUser を取り出そうとしてエラーになる
  const { setLoginUser } = useLoginUser()
  // ...
}
```

## なぜエラーが出るのか？

### 原因の流れ

```
1. createContext の初期値が undefined
       ↓
2. createContext<LoginUserContextType | undefined> なので
   useContext の返り値も「LoginUserContextType | undefined」になる
       ↓
3. useLoginUser() の返り値も「LoginUserContextType | undefined」になる
       ↓
4. useAuth.ts で const { setLoginUser } = useLoginUser() と書くと
   TypeScriptが「undefinedかもしれん値から分割代入するな」とエラーを出す
```

### なぜcreateContextの初期値がundefinedなのか？

```tsx
const LoginUserContext = createContext<LoginUserContextType | undefined>(undefined);
//                                                                      ^^^^^^^^^
//                                                                      この初期値
```

createContextの初期値は「Providerで囲まれていないコンポーネントがContextを使おうとしたとき」に返る値。
ログインユーザーはアプリ起動時にはまだ存在しないから、初期値はundefinedにするしかない。

### TypeScriptの立場で考える

TypeScriptは「実行時にProviderで囲まれているかどうか」を知らない。
型だけを見て判断するから「undefinedが返ってくる可能性がある」と判断し、エラーを出す。

## 修正後のコード

### useLoginUser.ts（修正後）

```tsx
import { useContext } from "react";
import { LoginUserContext } from "../providers/LoginUserProvider";
import type { LoginUserContextType } from "../providers/LoginUserProvider";

export const useLoginUser = (): LoginUserContextType => {
  const context = useContext(LoginUserContext);

  // undefinedチェック（型ガード）
  // Providerの外で使われた場合はエラーを投げる
  if (context === undefined) {
    throw new Error("useLoginUserはLoginUserProviderの中で使ってください");
  }

  // ここに到達した時点でcontextはundefinedではないことが確定
  // TypeScriptもそれを理解するので、返り値の型は LoginUserContextType になる
  return context;
};
```

### なぜこれで解決するのか？

```
1. useContext の返り値は相変わらず「LoginUserContextType | undefined」
       ↓
2. if (context === undefined) のチェックで undefined の場合はエラーを投げて関数終了
       ↓
3. if文を通過した後は「undefinedではない」ことが確定する（TypeScriptの型の絞り込み）
       ↓
4. return context の型は LoginUserContextType に確定
       ↓
5. useLoginUser() の返り値が LoginUserContextType になるので
   呼び出し側で分割代入してもエラーが出ない
```

## 補足：型の絞り込み（Type Narrowing）とは

TypeScriptはif文やtypeof等の条件分岐を見て、その後の型を自動的に絞り込む機能がある。

```tsx
const value: string | undefined = getSomeValue();

// ここでは value は string | undefined
if (value === undefined) {
  return; // ここで関数を抜ける
}
// ここでは value は string に絞り込まれる（undefinedはif文で除外されたから）

console.log(value.toUpperCase()); // エラーにならない
```

今回のContextのundefinedチェックもこれと同じ仕組み。
