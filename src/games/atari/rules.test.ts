import { COLORS, createState, remainingSeconds, start, tapTile, update } from './rules.ts'

describe('反射神経チェックのルール', () => {
  it('スタート前はタップしても変わらない', () => {
    const state = tapTile(createState(), 0, 0)
    expect(state.score).toBe(0)
    expect(state.phase).toBe('ready')
  })

  it('9枚のタイルには9色がちょうど1枚ずつ並び、当たりはその中のどれかの色になる', () => {
    for (let i = 0; i < 20; i++) {
      const state = start(0)
      expect(state.tiles).toHaveLength(COLORS.length)
      expect(new Set(state.tiles).size).toBe(COLORS.length)
      for (const color of COLORS) {
        expect(state.tiles).toContain(color)
      }
      expect(state.tiles).toContain(state.target)
    }
  })

  it('当たりをタップすると得点が増え、タイルの色はまた9色そろった新しい並びになる', () => {
    const state = start(0)
    const hitIndex = state.tiles.indexOf(state.target)

    const after = tapTile(state, hitIndex, 1000)
    expect(after.score).toBe(1)
    expect(after.phase).toBe('playing')
    expect(new Set(after.tiles).size).toBe(COLORS.length)
    expect(after.tiles).toContain(after.target)
  })

  it('外れを1回タップした時点でゲームオーバーになる', () => {
    const state = start(0)
    const missIndex = state.tiles.findIndex((color) => color !== state.target)
    expect(missIndex).toBeGreaterThanOrEqual(0)

    const after = tapTile(state, missIndex, 1000)
    expect(after.phase).toBe('finished')
    expect(after.score).toBe(0)
  })

  it('残り時間は20秒から減り、0 より小さくならない', () => {
    const state = start(0)
    expect(remainingSeconds(state, 0)).toBe(20)
    expect(remainingSeconds(state, 5000)).toBe(15)
    expect(remainingSeconds(state, 99999)).toBe(0)
  })

  it('20秒たつと終わり、それ以降はタップしても得点が変わらない', () => {
    let state = start(0)
    state = update(state, 20000)
    expect(state.phase).toBe('finished')

    const before = state.score
    state = tapTile(state, 0, 20001)
    expect(state.score).toBe(before)
    expect(state.phase).toBe('finished')
  })
})
