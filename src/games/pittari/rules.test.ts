import {
  createState,
  elapsedSeconds,
  gapSeconds,
  pickTarget,
  rating,
  start,
  stop,
} from './rules.ts'

describe('ぴったりストップのルール', () => {
  it('スタート前にストップを押しても何も変わらない', () => {
    const state = stop(createState(), 1000)
    expect(state.phase).toBe('ready')
  })

  it('スタート後に経過時間が増え、ストップで止まる', () => {
    let state = start(1000, 5)
    expect(elapsedSeconds(state, 3500)).toBe(2.5)
    state = stop(state, 6000)
    expect(state.phase).toBe('stopped')
    expect(elapsedSeconds(state, 99999)).toBe(5)
  })

  it('止めたあとにもう一度ストップを押しても、止めた時刻は変わらない', () => {
    const state = stop(stop(start(0, 5), 4870), 9000)
    expect(elapsedSeconds(state, 99999)).toBe(4.87)
  })

  it('ずれは、はやいとマイナス・おそいとプラスになる', () => {
    expect(gapSeconds(4.87, 5)).toBe(-0.13)
    expect(gapSeconds(5.2, 5)).toBe(0.2)
    expect(gapSeconds(5, 5)).toBe(0)
  })

  it('ずれは、目標の秒数からの差で計算する', () => {
    expect(gapSeconds(7.1, 7)).toBe(0.1)
    expect(gapSeconds(9.5, 10)).toBe(-0.5)
    expect(gapSeconds(3, 3)).toBe(0)
  })

  it('スタートすると、目標の秒数が状態に入る', () => {
    expect(start(0, 8).targetSeconds).toBe(8)
  })

  it('目標の秒数は 3〜10 のどれかになる（乱数の両はし）', () => {
    expect(pickTarget(null, () => 0)).toBe(3)
    expect(pickTarget(null, () => 0.999)).toBe(10)
  })

  it('前回と同じ秒数は選ばない', () => {
    for (let previous = 3; previous <= 10; previous++) {
      for (const random of [0, 0.25, 0.5, 0.75, 0.999]) {
        const target = pickTarget(previous, () => random)
        expect(target).not.toBe(previous)
        expect(target).toBeGreaterThanOrEqual(3)
        expect(target).toBeLessThanOrEqual(10)
      }
    }
  })

  it('乱数しだいで 3〜10 の全部が出る', () => {
    const seen = new Set<number>()
    for (let i = 0; i < 80; i++) seen.add(pickTarget(null, () => i / 80))
    expect([...seen].sort((a, b) => a - b)).toEqual([3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('ずれが小さいほど良い評価が出る（境目の値）', () => {
    expect(rating(0)).toBe('ぴったり！')
    expect(rating(0.05)).toBe('ぴったり！')
    expect(rating(-0.05)).toBe('ぴったり！')
    expect(rating(0.06)).toBe('おしい！')
    expect(rating(-0.3)).toBe('おしい！')
    expect(rating(0.31)).toBe('もう少し！')
    expect(rating(1)).toBe('もう少し！')
    expect(rating(-1.01)).toBe('まだまだ！')
  })
})
