import { useEffect, useState } from 'react'
import './StopGame.css'
import { createState, currentPosition, start, stop } from './rules.ts'

export function StopGame() {
  const [state, setState] = useState(createState)
  const [now, setNow] = useState(() => Date.now())

  // 動いている間だけ、画面を新しくするたびに時計を進めてバーを動かす
  useEffect(() => {
    if (state.phase !== 'playing') return
    let frame = requestAnimationFrame(function tick() {
      setNow(Date.now())
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [state.phase])

  function handleStart() {
    const time = Date.now()
    setNow(time)
    setState(start(time))
  }

  function handleStop() {
    setState((current) => stop(current, Date.now()))
  }

  const position =
    state.phase === 'playing' ? currentPosition(state, now) : state.position

  return (
    <div className="stop">
      {state.phase === 'ready' && <p>バーを真ん中でぴったり止めよう！</p>}
      {state.phase === 'playing' && <p>真ん中で止めてね</p>}
      {state.phase === 'stopped' && (
        <>
          <p>おしまい！</p>
          <p className="stop-score">{state.score} 点</p>
        </>
      )}

      <div className="stop-track">
        <div className="stop-center" />
        <div className="stop-bar" style={{ left: `${position * 100}%` }} />
      </div>

      {state.phase === 'playing' ? (
        <button className="stop-button stop-stop" onClick={handleStop}>
          ストップ！
        </button>
      ) : (
        <button className="stop-button" onClick={handleStart}>
          {state.phase === 'ready' ? 'スタート' : 'もう一回'}
        </button>
      )}
    </div>
  )
}
