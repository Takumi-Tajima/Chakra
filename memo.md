## 作成したい機能
ログインしたユーザーが管理者かどうかを判定する機能

## 動画内の手順
- src/providers/にLoginUserProvider.tsxを生成する
  - ログインしたユーザーcreateContextを利用してproviderを生成する。
- src/router/Router.tsxでLoginUserProviderを呼び出す。
  - 全体をproviderで囲うよ
- src/hooks/ディレクトリ配下で、LoginUserProviderのcontextを呼び出せるようなカスタムフックを生成する
