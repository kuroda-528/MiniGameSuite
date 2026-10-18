// 「神経衰弱」のルールの計算。画面とは分けておくと、テストで確かめやすい

// カードのおもてに書く文字。2枚ずつ使うので、8ペア＝16枚になる
export const SYMBOLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export type Card = {
  symbol: string // おもての文字
  faceUp: boolean // 表になっているか
  matched: boolean // そろったか
}

export type MemoryState = {
  phase: 'ready' | 'playing' | 'finished' // スタート前 / 遊んでいる / 終わった
  cards: Card[]
  flipped: number[] // いまめくっている（まだそろっていない）カードの番号。最大2つ
  moves: number // めくった回数（2枚で1回）
}

export function createState(): MemoryState {
  return { phase: 'ready', cards: [], flipped: [], moves: 0 }
}

// 並びを変えずに、A, A, B, B, ... の順でカードを作る
export function createCards(): Card[] {
  return SYMBOLS.flatMap((symbol) => [
    { symbol, faceUp: false, matched: false },
    { symbol, faceUp: false, matched: false },
  ])
}

// ばらばらにまぜる。random を外から渡せるようにしておくと、テストで並びを決められる
export function shuffle<T>(
  items: T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items]
  // 後ろから順に、自分より前のどれかと入れかえる（フィッシャー–イェーツという方法）
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function start(random: () => number = Math.random): MemoryState {
  return {
    phase: 'playing',
    cards: shuffle(createCards(), random),
    flipped: [],
    moves: 0,
  }
}

// 2枚めくっていて、ちがう文字だったとき。裏にもどすまでは次をめくれない
export function isWaiting(state: MemoryState): boolean {
  return state.flipped.length === 2
}

// index 番目のカードをめくる
export function flip(state: MemoryState, index: number): MemoryState {
  const card = state.cards[index]
  // 遊んでいないとき・待っているとき・もう表のカードは、何もしない
  if (state.phase !== 'playing' || isWaiting(state) || !card || card.faceUp) {
    return state
  }

  const cards = state.cards.map((c, i) =>
    i === index ? { ...c, faceUp: true } : c,
  )
  const flipped = [...state.flipped, index]

  // 1枚目なら、表にするだけ
  if (flipped.length < 2) {
    return { ...state, cards, flipped }
  }

  // 2枚目なら、回数をふやして、そろったか確かめる
  const moves = state.moves + 1
  const [first, second] = flipped
  if (cards[first].symbol !== cards[second].symbol) {
    return { ...state, cards, flipped, moves }
  }

  const matchedCards = cards.map((c, i) =>
    i === first || i === second ? { ...c, matched: true } : c,
  )
  const allMatched = matchedCards.every((c) => c.matched)
  return {
    phase: allMatched ? 'finished' : 'playing',
    cards: matchedCards,
    flipped: [],
    moves,
  }
}

// ちがう文字だった2枚を裏にもどす。画面は少し待ってからこれを呼ぶ
export function hideMismatched(state: MemoryState): MemoryState {
  if (!isWaiting(state)) return state
  const cards = state.cards.map((c, i) =>
    state.flipped.includes(i) ? { ...c, faceUp: false } : c,
  )
  return { ...state, cards, flipped: [] }
}
