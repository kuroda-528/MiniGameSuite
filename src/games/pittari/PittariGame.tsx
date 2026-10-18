import { useEffect, useState } from 'react'
import './PittariGame.css'
import {
  createState,
  elapsedSeconds,
  gapSeconds,
  pickTarget,
  rating,
  start,
  stop,
} from './rules.ts'

export function PittariGame() {
  const [state, setState] = useState(createState)
  const [now, setNow] = useState(() => Date.now())

  // 数字が動いている間だけ、0.01秒ごとに時計を進めて表示し直す
  useEffect(() => {
    if (state.phase !== 'playing') return
    const timer = setInterval(() => setNow(Date.now()), 10)
    return () => clearInterval(timer)
  }, [state.phase])

  function handleStart() {
    const time = Date.now()
    setNow(time)
    setState((current) => start(time, pickTarget(current.targetSeconds)))
  }

  function handleStop() {
    setState((current) => stop(current, Date.now()))
  }

  if (state.phase === 'ready') {
    return (
      <div className="pittari">
        <p>
          数字が動くよ。ねらいの秒数はスタートで決まるよ。ぴったり止められるかな？
        </p>
        <button className="pittari-start" onClick={handleStart}>
          スタート
        </button>
      </div>
    )
  }

  const elapsed = elapsedSeconds(state, now)
  const target = state.targetSeconds ?? 0

  if (state.phase === 'stopped') {
    const gap = gapSeconds(elapsed, target)
    const gapText =
      gap === 0
        ? 'ずれなし'
        : `${Math.abs(gap).toFixed(2)} 秒${gap < 0 ? 'はやい' : 'おそい'}`
    return (
      <div className="pittari">
        <p>ねらいは {target} 秒でした</p>
        <p className="pittari-time">{elapsed.toFixed(2)} 秒</p>
        <p>{gapText}</p>
        <p className="pittari-rating">{rating(gap)}</p>
        <button className="pittari-start" onClick={handleStart}>
          もう一回
        </button>
      </div>
    )
  }

  return (
    <div className="pittari">
      <p>ねらいは {target} 秒！</p>
      <p className="pittari-time">{elapsed.toFixed(2)} 秒</p>
      <button className="pittari-stop" onClick={handleStop}>
        ストップ！
      </button>
    </div>
  )
}
