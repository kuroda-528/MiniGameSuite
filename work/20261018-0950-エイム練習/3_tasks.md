# 3. Tasks — ゲーム「エイム練習」を追加する

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

- [x] 作業ブランチ `feature/game-aim` を切る
- [x] `src/games/aim/rules.ts`：ルールの計算（純粋関数）。スタート・命中判定・ミス・残り時間・命中率・平均反応時間
- [x] `src/games/aim/rules.test.ts`：ルールのテスト
- [x] `src/games/aim/AimGame.tsx` / `AimGame.css`：画面（スタート → 20秒ねらう → 結果 → もう一回）
- [x] `src/games/aim/AimGame.test.tsx`：画面のテスト（スタートできる・的を押すと命中が増える・外すとミスが増える）
- [x] `src/games/aim/index.ts`：登録。作者は `FPSゲーム大好きな作者`
- [x] `src/games/index.ts` に aim の1行を足す
- [x] ローカルで動作確認（一覧 → 遊ぶ → 結果 → もう一回、スマホ幅の表示）
- [ ] コミットして push し、PR を作る（ユーザーの指示を受けてから）
- [ ] プレビュー URL で動作確認
- [ ] ラップアップ（`/wrapup` を実行する）

## 品質チェック

- [x] テスト
- [x] 型チェック
- [x] lint
- [x] ビルド
