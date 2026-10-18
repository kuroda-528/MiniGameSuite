# 3. Tasks — ゲーム「ぴったりストップ」を作る

完了したら `- [x]` に消し込む。**全部終わってもファイルは削除せず残す。**

作業中に思いついたスコープ外のことはここに足さない。
`docs/backlog.md` か `docs/known-issues.md` に送る。

- [x] 作業ブランチ `feature/game-pittari` を切る
- [x] `src/games/pittari/rules.ts`：ずれの計算と評価の判定（純粋関数）
- [x] `src/games/pittari/rules.test.ts`：ぴったり・境目の値・はやい／おそい のテスト
- [x] `src/games/pittari/PittariGame.tsx`：画面（スタート → 数字が動く → ストップ → 結果 → もう一回）。時間は実際の時刻の差から出す
- [x] `src/games/pittari/PittariGame.css`：スマホで押せる大きさのボタン
- [x] `src/games/pittari/PittariGame.test.tsx`：画面のテスト
- [x] `src/games/pittari/index.ts`：登録（id は `pittari`、作者は `てってけ`）
- [x] `src/games/index.ts` に1行足す
- [x] ローカルで動作確認（一覧 → 遊ぶ → 結果 → もう一回、`/games/pittari` 直接アクセス）
- [x] （追加）`rules.ts`：目標秒数（3〜10）を状態に持たせる。スタートのたびにランダムに決める（前回の秒数はのぞく。乱数は外から渡せる形にする）。ずれの計算に使う。`rules.test.ts` も直す
- [x] （追加）`PittariGame.tsx`：スタート前の説明を直し、遊んでいる間と結果に目標秒数を出す。`PittariGame.test.tsx` も直す
- [x] （追加）ローカルで動作確認（いろいろな秒数が出る、もう一回で同じ秒数が続かない）
- [ ] コミットして push し、PR を作る（ユーザーの指示を受けてから）
- [ ] プレビュー URL で PC・スマホから動作確認
- [ ] ラップアップ（`/wrapup` を実行する）

## 品質チェック

- [x] テスト
- [x] 型チェック
- [x] lint
- [x] ビルド
