# games/README.md — ゲームを1本足すには

このディレクトリにゲームを1本足すと、トップの一覧に自動で表示されます。
`core/` や `features/` の中身を変える必要はありません。

**完成の目安**

> 自分のパソコンで一覧から自分のゲームを選んで最後まで遊べて、
> テスト・型チェック・lint が通り、本家に PR を出せたら完成。
> **main へのマージは含みません**（先生が取り込みます）。

## 守ること

- 作者名は**ニックネーム**にする。本名・学校名・顔写真は入れない
- 自分で作っていない画像・音を使うときは、先に先生に確認し、`docs/credits.md` に出典を書く
- さわってよいのは `src/games/自分のid/` と、`src/games/index.ts` の自分の1行だけ

## 0. はじめに1回だけ：フォークして手元にコピーする

フォークは、本家のリポジトリを自分の GitHub アカウントにコピーしたもの。
本家には直接書き込めないので、自分のフォークで作業して、できたら本家に PR（変更を取り込んでもらうお願い）を出します。

1. https://github.com/saitokodomopg/MiniGameSuite を開き、右上の **Fork** を押す（設定は変えずに **Create fork**）
2. 自分のフォークをパソコンにコピーして、本家を `upstream` という名前で登録する

```bash
git clone https://github.com/自分のアカウント/MiniGameSuite.git
cd MiniGameSuite
git remote add upstream https://github.com/saitokodomopg/MiniGameSuite.git
npm install
```

- `origin` … 自分のフォーク。push する先
- `upstream` … 本家。最新を受け取るだけ（push はできない）

## 1. コードを書く

作り始める前に、本家の最新を取り込んで作業ブランチを切る。
ほかの人のゲームが増えているかもしれないため。

```bash
git switch main
git pull upstream main
git switch -c feature/game-自分のid
```

`src/games/renda/`（10秒れんだ）をお手本にします。

1. id（英小文字とハイフン。例：`janken`）を決めて、`src/games/自分のid/` フォルダを作る
2. ゲームの画面 `自分のゲーム名Game.tsx` を書く

```tsx
import { useState } from 'react'

export function JankenGame() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count} 回押した</button>
}
```

3. `index.ts` を書いて登録する

```ts
import { register } from '../../core/registry/registry.ts'
import { JankenGame } from './JankenGame.tsx'

register({
  id: 'janken', // フォルダ名と同じにする。他の人と重ならない名前
  title: 'じゃんけん', // 一覧に出る名前
  author: 'ニックネーム', // 本名は書かない
  description: 'ひとこと説明',
  Component: JankenGame,
})
```

4. `src/games/index.ts` に1行足す

```ts
import './janken/index.ts'
```

点数や残り時間など「ルールの計算」があるなら、`rules.ts` に分けてテストを書くと安心です
（`renda/rules.ts` と `renda/rules.test.ts` を参照）。

## 2. 自分のパソコンで確かめる

```bash
npm run dev
```

表示された URL（`http://localhost:5173/`）を開き、一覧から自分のゲームを選んで、最後まで遊べるか確かめる。
フォークからの PR ではプレビュー URL（確認用の公開ページ）が出ないので、**ここが動作確認の本番**です。

push の前に、チェックがすべて通ることを確かめる。

```bash
npm run test
npm run typecheck
npm run lint
```

## 3. フォークに push して、本家に PR を出す

```bash
git add src/games/自分のid src/games/index.ts
git commit -m "feat: ゲーム「〇〇」を追加"
git push -u origin feature/game-自分のid
```

1. 自分のフォークのページに出る「Compare & pull request」を押す
2. 送り先が **`saitokodomopg/MiniGameSuite` の `main`** になっているか確かめる
3. 「Allow edits by maintainers」にチェックを入れる（先生が小さな修正を足せるようにするため）
4. PR の説明のチェックリストを埋めて、PR を作る

**これができれば完成です。** あとは先生がマージすると、本番 URL に公開されます。

## こまったとき：PR が「コンフリクト」になった

みんなが `src/games/index.ts` に1行ずつ足すので、先にほかの人の PR が取り込まれると、
同じ場所がぶつかって「コンフリクト」と表示されることがあります。本家の最新を取り込んで直します。

```bash
git switch feature/game-自分のid
git pull upstream main
```

`src/games/index.ts` を開き、`<<<<<<<` `=======` `>>>>>>>` の印を消して、
**ほかの人の行と自分の行を両方残す**。保存したら、チェックをしてから push し直す。

```bash
npm run test
git add src/games/index.ts
git commit -m "fix: 本家の最新を取り込む"
git push
```

PR は自動で更新されます。新しく作り直す必要はありません。
