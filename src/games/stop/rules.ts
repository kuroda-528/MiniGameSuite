// 「ぴったりストップ」のルールの計算。画面とは分けておくと、テストで確かめやすい
// バーの位置は 0（左はし）〜 1（右はし）で表す。真ん中は 0.5

export const START_SPEED = 0.5 // スタート直後の速さ（1秒に、はしからはしまでの何回分すすむか）
export const ACCELERATION = 0.15 // 1秒ごとに、速さがどれだけ増えるか

export type StopState = {
  phase: 'ready' | 'playing' | 'stopped' // スタート前 / 動いている / 止めた
  startedAt: number | null // スタートした時刻（ミリ秒）
  position: number // 止めたときのバーの位置
  score: number // 止めたときの点数
}

export function createState(): StopState {
  return { phase: 'ready', startedAt: null, position: 0, score: 0 }
}

export function start(now: number): StopState {
  return { phase: 'playing', startedAt: now, position: 0, score: 0 }
}

// スタートしてから、バーが進んだ長さ。だんだん速くなるので、時間の2乗の形になる
function travelled(elapsedSeconds: number): number {
  return START_SPEED * elapsedSeconds + (ACCELERATION * elapsedSeconds ** 2) / 2
}

// いまの速さ
export function speedAt(elapsedSeconds: number): number {
  return START_SPEED + ACCELERATION * elapsedSeconds
}

// スタートしてからの時間（秒）で、バーの位置を出す。はしまで行ったら折り返す
export function positionAt(elapsedSeconds: number): number {
  const turn = travelled(Math.max(0, elapsedSeconds)) % 2 // 0〜2 で1往復
  return turn <= 1 ? turn : 2 - turn
}

// 点数。真ん中で 100 点、はしで 0 点
export function scoreOf(position: number): number {
  return Math.round(100 * (1 - Math.abs(position - 0.5) * 2))
}

// バーの位置を、時刻から出す
export function currentPosition(state: StopState, now: number): number {
  if (state.startedAt === null) return 0
  return positionAt((now - state.startedAt) / 1000)
}

// ストップボタンを押した。動いていないときは何も変わらない
export function stop(state: StopState, now: number): StopState {
  if (state.phase !== 'playing') return state
  const position = currentPosition(state, now)
  return { ...state, phase: 'stopped', position, score: scoreOf(position) }
}
