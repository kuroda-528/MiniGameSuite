# 3. Tasks — 2本目のミニゲーム「当たりはどれ？」を作る

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

- [x] 作業ブランチ `feature/game-atari` を切る
- [x] `src/games/atari/rules.ts`：当たり判定・スコア計算・残り時間の計算（純粋関数）とテスト（`rules.test.ts`）
- [x] `src/games/atari/AtariGame.tsx`：画面（スタート → 20秒プレイ → 結果 → もう一回）
- [x] `src/games/atari/AtariGame.css`：見た目（タイルの色・形、当たり表示）
- [x] `src/games/atari/index.ts`：`MiniGame` オブジェクトを `register()` で登録（id: `atari`、作者: 仮名「なぞ味のちゃぼ」）
- [x] `src/games/index.ts` に atari の import を1行追加
- [x] ローカルで動作確認（一覧 → 「当たりはどれ？」を選ぶ → 20秒プレイ → 結果 → もう一回、`/games/atari` 直接アクセス）
- [x] コミットして push し、PR を作る（ユーザーの指示を受けてから）
- [x] ラップアップ（`/wrapup` を実行する）

## 品質チェック

- [x] テスト
- [x] 型チェック
- [x] lint
- [x] ビルド
