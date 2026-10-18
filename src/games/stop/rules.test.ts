import {
  createState,
  positionAt,
  scoreOf,
  speedAt,
  start,
  stop,
} from './rules.ts'

describe('ぴったりストップのルール', () => {
  it('真ん中で100点、はしで0点、その間は真ん中に近いほど高い', () => {
    expect(scoreOf(0.5)).toBe(100)
    expect(scoreOf(0)).toBe(0)
    expect(scoreOf(1)).toBe(0)
    expect(scoreOf(0.25)).toBe(50)
    expect(scoreOf(0.45)).toBeGreaterThan(scoreOf(0.3))
  })

  it('バーは左はしから動き出す', () => {
    expect(positionAt(0)).toBe(0)
    expect(positionAt(0.5)).toBeGreaterThan(0)
  })

  it('右はしまで行ったら折り返し、位置はいつも 0〜1 の間', () => {
    let reachedRight = false
    let previous = positionAt(0)
    for (let t = 0.05; t <= 30; t += 0.05) {
      const position = positionAt(t)
      expect(position).toBeGreaterThanOrEqual(0)
      expect(position).toBeLessThanOrEqual(1)
      if (position < previous - 0.0001 && previous > 0.9) reachedRight = true
      previous = position
    }
    expect(reachedRight).toBe(true)
  })

  it('時間がたつほど速くなる', () => {
    expect(speedAt(5)).toBeGreaterThan(speedAt(0))
    expect(speedAt(10)).toBeGreaterThan(speedAt(5))
  })

  it('スタート前に止めても何も変わらない', () => {
    const state = createState()
    expect(stop(state, 1000)).toBe(state)
  })

  it('止めると、そのときの位置と点数が決まる', () => {
    const state = stop(start(0), 1000)
    expect(state.phase).toBe('stopped')
    expect(state.position).toBe(positionAt(1))
    expect(state.score).toBe(scoreOf(positionAt(1)))
  })

  it('止めたあとにもう一度止めても、点数は変わらない', () => {
    const stopped = stop(start(0), 1000)
    expect(stop(stopped, 5000)).toBe(stopped)
  })
})
