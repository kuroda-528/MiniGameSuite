import { useEffect, useState } from 'react'
import './AimGame.css'
import {
  TARGET_SIZE_PERCENT,
  TIME_LIMIT_SECONDS,
  accuracy,
  averageReactionMs,
  createState,
  hit,
  miss,
  remainingSeconds,
  start,
  update,
} from './rules.ts'

export function AimGame() {
  const [state, setState] = useState(createState)
  const [now, setNow] = useState(() => Date.now())

  // 遊んでいる間だけ、0.1秒ごとに時計を進めて残り時間を表示し直す
  useEffect(() => {
    if (state.phase !== 'playing') return
    const timer = setInterval(() => {
      const time = Date.now()
      setNow(time)
      setState((current) => update(current, time))
    }, 100)
    return () => clearInterval(timer)
  }, [state.phase])

  function handleStart() {
    const time = Date.now()
    setNow(time)
    setState(start(time, Math.random))
  }

  // 的を押したときに、うしろのプレイエリアの「ミス」まで動かないように止める
  function handleHit(event: React.MouseEvent) {
    event.stopPropagation()
    setState((current) => hit(current, Date.now(), Math.random))
  }

  function handleMiss() {
    setState((current) => miss(current, Date.now()))
  }

  if (state.phase === 'ready') {
    return (
      <div className="aim">
        <p>{TIME_LIMIT_SECONDS}秒間に、的をいくつ当てられるかな？</p>
        <p className="aim-note">的以外を押すとミスになるよ</p>
        <button className="aim-start" onClick={handleStart}>
          スタート
        </button>
      </div>
    )
  }

  if (state.phase === 'finished') {
    const average = averageReactionMs(state)
    return (
      <div className="aim">
        <p>おしまい！</p>
        <p className="aim-result">{state.hits} 個命中</p>
        <p>命中率 {accuracy(state).toFixed(0)}%</p>
        <p>
          平均反応時間{' '}
          {average === null ? '－' : `${(average / 1000).toFixed(2)} 秒`}
        </p>
        <button className="aim-start" onClick={handleStart}>
          もう一回
        </button>
      </div>
    )
  }

  return (
    <div className="aim">
      <div className="aim-status">
        <span>のこり {remainingSeconds(state, now).toFixed(1)} 秒</span>
        <span>命中 {state.hits}</span>
        <span>ミス {state.misses}</span>
      </div>
      <div className="aim-area" data-testid="aim-area" onClick={handleMiss}>
        <button
          className="aim-target"
          aria-label="的"
          style={{
            left: `${state.target.x}%`,
            top: `${state.target.y}%`,
            width: `${TARGET_SIZE_PERCENT}%`,
          }}
          onClick={handleHit}
        />
      </div>
    </div>
  )
}
