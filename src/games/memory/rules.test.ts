import {
  createCards,
  createState,
  flip,
  hideMismatched,
  isWaiting,
  shuffle,
  start,
} from './rules.ts'

// この random を渡すと、shuffle が並びを変えない（A, A, B, B, ... のまま）
const noShuffle = () => 0.99

describe('神経衰弱のルール', () => {
  it('カードは16枚で、どの文字もちょうど2枚ずつある', () => {
    const cards = createCards()
    expect(cards).toHaveLength(16)
    for (const card of cards) {
      expect(cards.filter((c) => c.symbol === card.symbol)).toHaveLength(2)
    }
  })

  it('シャッフルしても、カードの枚数と中身は変わらない', () => {
    const cards = createCards()
    const shuffled = shuffle(cards)
    expect(shuffled).toHaveLength(16)
    expect(shuffled.map((c) => c.symbol).sort()).toEqual(
      cards.map((c) => c.symbol).sort(),
    )
  })

  it('スタート前はめくれない', () => {
    const state = flip(createState(), 0)
    expect(state.phase).toBe('ready')
    expect(state.moves).toBe(0)
  })

  it('1枚目をめくると表になるが、回数はふえない', () => {
    const state = flip(start(noShuffle), 0)
    expect(state.cards[0].faceUp).toBe(true)
    expect(state.moves).toBe(0)
  })

  it('同じ文字を2枚めくると、そろって表のまま残り、回数が1ふえる', () => {
    let state = start(noShuffle)
    state = flip(state, 0) // A
    state = flip(state, 1) // A
    expect(state.cards[0].matched).toBe(true)
    expect(state.cards[1].matched).toBe(true)
    expect(state.moves).toBe(1)
    expect(isWaiting(state)).toBe(false)
  })

  it('ちがう文字を2枚めくると待ちになり、hideMismatched で裏にもどる', () => {
    let state = start(noShuffle)
    state = flip(state, 0) // A
    state = flip(state, 2) // B
    expect(state.moves).toBe(1)
    expect(isWaiting(state)).toBe(true)

    state = hideMismatched(state)
    expect(state.cards[0].faceUp).toBe(false)
    expect(state.cards[2].faceUp).toBe(false)
    expect(isWaiting(state)).toBe(false)
  })

  it('待っているあいだは、3枚目をめくれない', () => {
    let state = start(noShuffle)
    state = flip(state, 0)
    state = flip(state, 2)
    const after = flip(state, 4)
    expect(after).toBe(state)
  })

  it('もう表のカードをめくっても何も起きない', () => {
    let state = flip(start(noShuffle), 0)
    const again = flip(state, 0)
    expect(again).toBe(state)

    state = flip(state, 1) // そろえる
    expect(flip(state, 0)).toBe(state)
  })

  it('8ペアぜんぶそろうと終わる', () => {
    let state = start(noShuffle)
    for (let i = 0; i < 16; i += 2) {
      state = flip(state, i)
      state = flip(state, i + 1)
    }
    expect(state.phase).toBe('finished')
    expect(state.moves).toBe(8)
  })
})
