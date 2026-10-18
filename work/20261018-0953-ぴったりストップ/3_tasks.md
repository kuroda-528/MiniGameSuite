# 3. Tasks — 2本目のゲーム「ぴったりストップ」を作る

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

## 準備

- [x] 作業ブランチ `feature/game-stop` を作る（main では作業しない）

## ルールの計算（`src/games/stop/rules.ts`）

- [x] 点数を計算する関数を書く（真ん中=100点、端=0点。位置は 0〜1 で表す）
- [x] バーの位置を計算する関数を書く（経過時間 → 0〜1。端で折り返す）
- [x] 経過時間にあわせて速くなる速さの計算を書く
- [x] `rules.test.ts` にテストを書く（真ん中で100点、端で0点、折り返し、速くなる、を確かめる）

## 画面（`src/games/stop/`）

- [x] `StopGame.tsx` を書く（スタート → バーが動く → ストップ → 点数 → もう一回）
- [x] `StopGame.css` で見た目を整える（スマホでも押しやすい大きさのボタン）
- [x] `StopGame.test.tsx` を書く（スタートして止めると点数が出る）

## 登録

- [x] `src/games/stop/index.ts` で `register()` する（作者名は `tamaya`）
- [x] `src/games/index.ts` に `import './stop/index.ts'` を1行足す

## 動作確認

- [x] `npm run dev` で、一覧から選んで最後まで遊べる
- [x] バーが速くなるのが目で見てわかる
- [x] `/games/stop` を直接開いても 404 にならない

## 品質チェック

- [x] テスト（`npm run test`）
- [x] 型チェック（`npm run typecheck`）
- [x] lint（`npm run lint`）
- [x] ビルド（`npm run build`）

## 仕上げ

- [x] ラップアップ（`/wrapup` を実行する）
