# MiniGameSuite

## これは何か

プログラミング教室の中学生がチームで作り、インターネットに公開するミニゲーム集。
トップにゲームの一覧が並び、選ぶとログインなしですぐ遊べる。PC とスマホで遊べる。

- 公開 URL: https://minigamesuite.saito-kodomopg.workers.dev/
- ゲームを1本足す手順: [src/games/README.md](src/games/README.md)

## 動かし方

Node.js 20 以上が必要です。

```bash
# セットアップ
npm install

# 起動（http://localhost:5173/ を開く）
npm run dev

# テスト・型チェック・lint
npm run test
npm run typecheck
npm run lint
```

本家の main に PR がマージされると、Cloudflare Workers で自動的に公開されます。
生徒は自分のフォークから PR を出します（手順は [src/games/README.md](src/games/README.md)）。

## ドキュメント

| 知りたいこと       | 読むファイル                                 |
| ------------------ | -------------------------------------------- |
| 開発ルール         | [CLAUDE.md](CLAUDE.md)                       |
| 何を作っているか   | [docs/concept.md](docs/concept.md)           |
| 技術スタック・構造 | [docs/architecture.md](docs/architecture.md) |
| コード規約         | [docs/conventions.md](docs/conventions.md)   |
| 技術決定の履歴     | [docs/decisions/](docs/decisions/)           |
| 未対応の課題       | [docs/known-issues.md](docs/known-issues.md) |
| やりたいことリスト | [docs/backlog.md](docs/backlog.md)           |
| 借りた素材の出典   | [docs/credits.md](docs/credits.md)           |
