import {
  TARGET_SIZE_PERCENT,
  accuracy,
  averageReactionMs,
  createState,
  hit,
  miss,
  nextTarget,
  remainingSeconds,
  start,
  update,
} from './rules.ts'

// 決まった数を順番に返す「ランダム」。テストの結果を毎回同じにするため
function fixedRandom(...values: number[]) {
  let i = 0
  return () => values[i++ % values.length]
}

describe('エイム練習のルール', () => {
  it('スタート前は当てても外しても数えない', () => {
    let state = hit(createState(), 0, fixedRandom(0.5))
    state = miss(state, 0)
    expect(state.hits).toBe(0)
    expect(state.misses).toBe(0)
    expect(state.phase).toBe('ready')
  })

  it('当てると命中が増え、反応時間が足される', () => {
    let state = start(0, fixedRandom(0, 0))
    state = hit(state, 400, fixedRandom(1, 1))
    state = hit(state, 1000, fixedRandom(0, 0))
    expect(state.hits).toBe(2)
    expect(state.totalReactionMs).toBe(400 + 600)
    expect(averageReactionMs(state)).toBe(500)
  })

  it('外すとミスが増え、的はそのまま', () => {
    let state = start(0, fixedRandom(0.5))
    const target = state.target
    state = miss(state, 100)
    expect(state.misses).toBe(1)
    expect(state.target).toEqual(target)
  })

  it('的はプレイエリアからはみ出さない', () => {
    const half = TARGET_SIZE_PERCENT / 2
    expect(start(0, fixedRandom(0)).target).toEqual({ x: half, y: half })
    const far = start(0, fixedRandom(0.999999)).target
    expect(far.x).toBeLessThanOrEqual(100 - half)
    expect(far.y).toBeLessThanOrEqual(100 - half)
  })

  it('次の的は前の的から、的1個ぶん以上はなれた場所に出る', () => {
    const previous = { x: 50, y: 50 }
    // 1回目は同じ場所が出るので選び直し、2回目の場所になる
    const target = nextTarget(previous, fixedRandom(0.5, 0.5, 0, 0))
    expect(target).toEqual({
      x: TARGET_SIZE_PERCENT / 2,
      y: TARGET_SIZE_PERCENT / 2,
    })
  })

  it('何度選び直しても近い場所しか出ないときは、反対側に出す', () => {
    const target = nextTarget({ x: 20, y: 30 }, fixedRandom(0.1, 0.2))
    expect(target).toEqual({ x: 80, y: 70 })
  })

  it('命中率は 命中 ÷ 押した回数。押していなければ 0', () => {
    expect(accuracy(createState())).toBe(0)
    let state = start(0, fixedRandom(0.5))
    state = hit(state, 100, fixedRandom(0, 1))
    state = hit(state, 200, fixedRandom(1, 0))
    state = hit(state, 300, fixedRandom(0, 0))
    state = miss(state, 400)
    expect(accuracy(state)).toBe(75)
  })

  it('1回も当てていなければ、平均反応時間は null', () => {
    expect(averageReactionMs(start(0, fixedRandom(0.5)))).toBeNull()
  })

  it('残り時間は20秒から減り、0 より小さくならない', () => {
    const state = start(0, fixedRandom(0.5))
    expect(remainingSeconds(state, 0)).toBe(20)
    expect(remainingSeconds(state, 3500)).toBe(16.5)
    expect(remainingSeconds(state, 99999)).toBe(0)
  })

  it('20秒たつと終わり、それ以降は当てても外しても数えない', () => {
    let state = hit(start(0, fixedRandom(0.5)), 19999, fixedRandom(0, 0))
    state = update(state, 20000)
    expect(state.phase).toBe('finished')
    state = hit(state, 20001, fixedRandom(0, 0))
    state = miss(state, 20002)
    expect(state.hits).toBe(1)
    expect(state.misses).toBe(0)
  })

  it('update を呼ぶ前でも、時間切れのあとに押した分は数えない', () => {
    const state = hit(start(0, fixedRandom(0.5)), 20500, fixedRandom(0, 0))
    expect(state.hits).toBe(0)
    expect(state.phase).toBe('finished')
  })
})
