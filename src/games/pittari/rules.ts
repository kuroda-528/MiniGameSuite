// 「ぴったりストップ」のルールの計算。画面とは分けておくと、テストで確かめやすい

export const MIN_TARGET_SECONDS = 3
export const MAX_TARGET_SECONDS = 10

export type PittariState = {
  phase: 'ready' | 'playing' | 'stopped' // スタート前 / 数字が動いている / 止めた
  targetSeconds: number | null // 目標の秒数。スタートするたびに決まる
  startedAt: number | null // スタートした時刻（ミリ秒）
  stoppedAt: number | null // ストップした時刻（ミリ秒）
}

export function createState(): PittariState {
  return {
    phase: 'ready',
    targetSeconds: null,
    startedAt: null,
    stoppedAt: null,
  }
}

// 目標の秒数をランダムに決める。前回と同じ秒数は選ばない
// random は 0 以上 1 未満の数を返す関数。テストでは決まった値を返すものを渡す
export function pickTarget(
  previous: number | null,
  random: () => number = Math.random,
): number {
  const candidates: number[] = []
  for (
    let seconds = MIN_TARGET_SECONDS;
    seconds <= MAX_TARGET_SECONDS;
    seconds++
  ) {
    if (seconds !== previous) candidates.push(seconds)
  }
  return candidates[Math.floor(random() * candidates.length)]
}

export function start(now: number, targetSeconds: number): PittariState {
  return { phase: 'playing', targetSeconds, startedAt: now, stoppedAt: null }
}

// ストップを押した。動いていないときに押しても何も変わらない
export function stop(state: PittariState, now: number): PittariState {
  if (state.phase !== 'playing') return state
  return { ...state, phase: 'stopped', stoppedAt: now }
}

// 表示する経過時間（秒）。止めたあとは止めた時刻で固定する
export function elapsedSeconds(state: PittariState, now: number): number {
  if (state.startedAt === null) return 0
  const end = state.stoppedAt ?? now
  return Math.max(0, (end - state.startedAt) / 1000)
}

// 目標の秒数とのずれ（秒）。はやく止めるとマイナス、おそく止めるとプラス
// 画面に出す小数第2位までで丸めて、表示と判定がずれないようにする
export function gapSeconds(elapsed: number, targetSeconds: number): number {
  return Math.round((elapsed - targetSeconds) * 100) / 100
}

// ずれの大きさに合わせたひとこと評価
export function rating(gap: number): string {
  const size = Math.abs(gap)
  if (size <= 0.05) return 'ぴったり！'
  if (size <= 0.3) return 'おしい！'
  if (size <= 1) return 'もう少し！'
  return 'まだまだ！'
}
