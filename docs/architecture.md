# Architecture

技術スタックと構造の決定事項。**変更には承認が必要。**

## 技術スタック

| 分類 | 採用 | 理由 |
|------|------|------|
| 言語 | TypeScript | 型があると補完で「次に何を書くか」が見え、Claude Code の支援も正確になる。TypingSuite と同じ |
| フレームワーク | React | 情報が多く調べやすい。TypingSuite と同じなので経験を使い回せる |
| ルーティング | React Router | ゲームごとの URL（`/games/renda`）を作れる。URL を送って共有しやすい |
| ビルドツール | Vite | 起動が速く、保存するとすぐ画面に反映される |
| データ永続化 | なし | 最初の公開では記録を保存しない（concept.md「やらないこと」） |
| テスト | Vitest + Testing Library | Vite と同じ仕組みで動くため追加設定がほぼ不要 |
| lint / formatter | ESLint + Prettier | 書き方の差を自動でそろえる。TypingSuite と同じ設定 |
| ホスティング | Cloudflare Workers（Static Assets）＋ Workers Builds | TypingSuite と同じアカウント。git push で自動公開 |

**却下した選択肢**

| 選択肢 | 却下理由 |
|--------|----------|
| Vanilla JS（フレームワークなし） | 1本目は簡単だが、ゲームと画面が増えると登録の仕組みが作りにくい。TypingSuite と書き方がずれる |
| Supabase で記録を保存 | 今は不要。ランキングは利用者入力の公開になるため、先生と相談してから |
| ゲームエンジン（Phaser 等） | クリック中心のミニゲームには重い。必要なゲームが出たら ADR で検討 |
| CoreServer で静的配信 | 手動アップロードになり、複数人だと上げ忘れ・上書き事故が起きる |

## 実行環境

- 動作対象: PC・スマホのモダンブラウザ（Chrome / Edge / Safari 最新版）
- 必要なランタイム・バージョン: Node.js 20 以上（開発時のみ。本番は静的ファイル）
- 公開方法: main ブランチへの push で自動デプロイ。手動アップロードはしない
- 本番URL: https://minigamesuite.saito-kodomopg.workers.dev/

## コマンド

Claude が品質チェックで実行するコマンド。
**ここに書かれたものが `/wrapup` で実行される。**

```bash
# セットアップ
npm install

# 開発サーバー起動
npm run dev

# テスト
npm run test

# 型チェック
npm run typecheck

# lint
npm run lint

# ビルド（公開する成果物を作る。通常は push 時に自動実行される）
npm run build
```

## ディレクトリ構成

```
src/
├── core/           # 土台。原則さわらない
│   ├── types/      # ゲームの型（MiniGame）
│   └── registry/   # ゲームの登録場所
├── games/          # ゲーム（1人1ディレクトリで担当）
│   ├── README.md   # 生徒向け：ゲームを1本足す手順
│   ├── index.ts    # 登録用 import を1行ずつ並べる
│   └── renda/      # 10秒れんだ
├── features/       # 画面のまとまり
│   ├── menu/       # ゲーム一覧（トップ）
│   └── play/       # ゲームを遊ぶ画面の枠（タイトル・戻るボタン）
└── shared/         # 共通の部品（ボタン・レイアウトなど）
```

### 責務の境界

| ディレクトリ | 責務 | 誰がさわるか |
|-------------|------|-------------|
| `core/` | ゲームの型・登録の仕組み | 土台担当（先生）のみ。変更時は全員に共有 |
| `games/<自分のid>/` | ゲームの中身 | 担当の生徒が自分のディレクトリだけ |
| `games/index.ts` | 登録用 import の一覧 | 各自が自分の1行だけ足す |
| `features/` `shared/` | 画面の組み立て・共通部品 | 土台担当 |

**`games/` は `core/` `shared/` に依存してよいが、`core/` から `games/` を参照しない。**
この向きを守ることで、ゲームを足しても土台が壊れない。

## 拡張の仕組み

ゲームは **registry への登録**で増やす。土台の書き換えは不要。

```ts
// src/core/types/game.ts（土台側・確定したら変えない）
export type MiniGame = {
  id: string                      // URL になる（/games/<id>）。英小文字とハイフン
  title: string                   // 一覧に出す名前
  author: string                  // 作者のニックネーム（本名は書かない）
  description: string             // ひとこと説明
  Component: React.ComponentType  // ゲーム本体
}
```

新しいゲームを足す手順は3つ。

1. `src/games/自分のid/` を作る
2. `MiniGame` を満たすオブジェクトを書き、`register()` で登録する
3. `src/games/index.ts` に登録用の import を1行追加する

登録したゲームはトップの一覧に自動で表示される。
生徒向けの詳しい手順は `src/games/README.md` を参照。

## 認証の方針

なし（ログインしない）。

## データ設計

なし（保存しない）。

## 外部依存

| 依存先 | 用途 | 代替手段の有無 |
|--------|------|----------------|
| Cloudflare Workers | 静的ファイル配信・自動デプロイ | あり（ビルド成果物を置くだけなので移行は軽い） |
| GitHub | ソース管理・PR | あり |

## 外部サービスの役割

### Cloudflare Workers（Static Assets + Workers Builds）

- **役割**: `npm run build` の成果物（`dist/`）を配るだけ。サーバー処理は実行しない
- **デプロイ／設定されるもの**: ビルド成果物のみ。設定は `wrangler.jsonc`
  （`name: minigamesuite`、SPA 用に `assets.not_found_handling: single-page-application`。
  未設定だと `/games/renda` への直リンクが 404 になる）
- **トリガー**: `main` への push（PR のマージ）で本番公開。本家の他ブランチへの push でプレビュー URL を発行。
  **フォークのブランチはビルドされないため、生徒の PR にはプレビュー URL が出ない**（ADR 0002）
- **接続方法**: Cloudflare 管理画面で GitHub リポジトリをつなぐ（先生が一度だけ操作）
- **関与するタイミング**: ページを最初に開く瞬間だけ。遊んでいる間の処理はすべてブラウザ内

### GitHub

- **役割**: `saitokodomopg/MiniGameSuite`（Public）。ソースの置き場と PR
- **運用**: 生徒はフォーク → 作業ブランチ → 自分のフォークに push → 本家の `main` へ PR → 先生がマージ（ADR 0002）
- **権限**: 本家に書き込めるのは先生だけ。生徒には collaborator 権限を渡さない
- **PR の確認**: 生徒は手元で `npm run dev` とテスト・型チェック・lint を通してから PR を出す。
  先生は必要なら `gh pr checkout <PR番号>` で手元に取ってきて確認する

## 制約・前提

- 記録は保存しない。リロードすると消える
- 画像・音はゲームのディレクトリに置き、借りたものは `docs/credits.md` に書く
- リポジトリもゲームも公開される。個人が特定できる情報は入れない

---

技術判断の経緯は `docs/decisions/` の ADR を参照。
