// 「反射神経チェック」のルールの計算。画面とは分けておくと、テストで確かめやすい

export const TIME_LIMIT_SECONDS = 20

export type Color =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'lime'

// タイルは必ずこの9色が1枚ずつ並ぶ（同じ色は重複しない）
export const COLORS: Color[] = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'cyan',
  'lime',
]

export const BOARD_SIZE = COLORS.length

export type AtariState = {
  phase: 'ready' | 'playing' | 'finished' // スタート前 / 遊んでいる / 終わった
  startedAt: number | null // スタートした時刻（ミリ秒）
  score: number // 当たりを探せた回数
  tiles: Color[] // 今の画面に並んでいるタイルの色（9色がシャッフルされたもの）
  target: Color // 今回の当たりの色
}

// 配列の並びをシャッフルする（Fisher-Yates）。元の配列は変えない
function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 新しい問題（タイルの配置と当たりの色）を作る。9色すべてが1枚ずつ、順番はシャッフルされる
function createRound(random: () => number): { tiles: Color[]; target: Color } {
  const tiles = shuffle(COLORS, random)
  const target = tiles[Math.floor(random() * tiles.length)]
  return { tiles, target }
}

export function createState(): AtariState {
  return { phase: 'ready', startedAt: null, score: 0, tiles: [], target: COLORS[0] }
}

export function start(now: number, random: () => number = Math.random): AtariState {
  const round = createRound(random)
  return { phase: 'playing', startedAt: now, score: 0, tiles: round.tiles, target: round.target }
}

// 残り時間（秒）。0 より小さくはならない
export function remainingSeconds(state: AtariState, now: number): number {
  if (state.startedAt === null) return TIME_LIMIT_SECONDS
  const elapsed = (now - state.startedAt) / 1000
  return Math.max(0, TIME_LIMIT_SECONDS - elapsed)
}

// 時間切れなら終わりにする。画面は定期的にこれを呼ぶ
export function update(state: AtariState, now: number): AtariState {
  if (state.phase === 'playing' && remainingSeconds(state, now) === 0) {
    return { ...state, phase: 'finished' }
  }
  return state
}

// タイルを1つタップした。当たりなら得点+1して次の問題へ。外れたらその時点でゲームオーバー
export function tapTile(
  state: AtariState,
  index: number,
  now: number,
  random: () => number = Math.random,
): AtariState {
  const current = update(state, now)
  if (current.phase !== 'playing') return current
  if (current.tiles[index] !== current.target) {
    return { ...current, phase: 'finished' }
  }
  const round = createRound(random)
  return { ...current, score: current.score + 1, tiles: round.tiles, target: round.target }
}
