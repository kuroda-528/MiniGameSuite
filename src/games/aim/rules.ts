// 「エイム練習」のルールの計算。画面とは分けておくと、テストで確かめやすい

export const TIME_LIMIT_SECONDS = 20

// 的の大きさ（プレイエリアの幅に対する %）。プレイエリアは正方形なので縦も同じ
export const TARGET_SIZE_PERCENT = 12

// ランダムな数（0 以上 1 未満）を作る関数。テストでは決まった数を返す関数を渡して、結果を固定する
export type Random = () => number

export type Target = {
  x: number // 的の中心の横の位置（%）
  y: number // 的の中心の縦の位置（%）
}

export type AimState = {
  phase: 'ready' | 'playing' | 'finished' // スタート前 / 遊んでいる / 終わった
  startedAt: number | null // スタートした時刻（ミリ秒）
  hits: number // 的に当てた回数
  misses: number // 的以外を押した回数
  target: Target // いま出ている的
  targetShownAt: number // いまの的が出た時刻（ミリ秒）。反応時間を計るのに使う
  totalReactionMs: number // 当てるまでにかかった時間の合計（ミリ秒）
}

// 的がプレイエリアからはみ出さないように、中心は端から半径ぶん内側に置く
function randomTarget(random: Random): Target {
  const min = TARGET_SIZE_PERCENT / 2
  const range = 100 - TARGET_SIZE_PERCENT
  return { x: min + random() * range, y: min + random() * range }
}

// 次の的。前の的とほぼ同じ場所に出ると練習にならないので、的1個ぶん以上はなれた場所を選ぶ
export function nextTarget(previous: Target, random: Random): Target {
  for (let i = 0; i < 10; i++) {
    const target = randomTarget(random)
    const distance = Math.hypot(target.x - previous.x, target.y - previous.y)
    if (distance >= TARGET_SIZE_PERCENT) return target
  }
  // 10回やっても近い場所しか出ないときは、真ん中の反対側に出す
  return { x: 100 - previous.x, y: 100 - previous.y }
}

export function createState(): AimState {
  return {
    phase: 'ready',
    startedAt: null,
    hits: 0,
    misses: 0,
    target: { x: 50, y: 50 },
    targetShownAt: 0,
    totalReactionMs: 0,
  }
}

export function start(now: number, random: Random): AimState {
  return {
    phase: 'playing',
    startedAt: now,
    hits: 0,
    misses: 0,
    target: randomTarget(random),
    targetShownAt: now,
    totalReactionMs: 0,
  }
}

// 残り時間（秒）。0 より小さくはならない
export function remainingSeconds(state: AimState, now: number): number {
  if (state.startedAt === null) return TIME_LIMIT_SECONDS
  const elapsed = (now - state.startedAt) / 1000
  return Math.max(0, TIME_LIMIT_SECONDS - elapsed)
}

// 時間切れなら終わりにする。画面は定期的にこれを呼ぶ
export function update(state: AimState, now: number): AimState {
  if (state.phase === 'playing' && remainingSeconds(state, now) === 0) {
    return { ...state, phase: 'finished' }
  }
  return state
}

// 的に当てた。反応時間を足して、次の的を出す。時間切れのあとは数えない
export function hit(state: AimState, now: number, random: Random): AimState {
  const current = update(state, now)
  if (current.phase !== 'playing') return current
  return {
    ...current,
    hits: current.hits + 1,
    totalReactionMs: current.totalReactionMs + (now - current.targetShownAt),
    target: nextTarget(current.target, random),
    targetShownAt: now,
  }
}

// 的以外を押した。時間切れのあとは数えない
export function miss(state: AimState, now: number): AimState {
  const current = update(state, now)
  if (current.phase !== 'playing') return current
  return { ...current, misses: current.misses + 1 }
}

// 命中率（%）。1回も押していないときは 0
export function accuracy(state: AimState): number {
  const shots = state.hits + state.misses
  if (shots === 0) return 0
  return (state.hits / shots) * 100
}

// 平均反応時間（ミリ秒）。1回も当てていないときは null（計れないため）
export function averageReactionMs(state: AimState): number | null {
  if (state.hits === 0) return null
  return state.totalReactionMs / state.hits
}
