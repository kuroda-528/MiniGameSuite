import { useEffect, useState } from 'react'
import './AtariGame.css'
import {
  TIME_LIMIT_SECONDS,
  createState,
  remainingSeconds,
  start,
  tapTile,
  update,
  type Color,
} from './rules.ts'

const COLOR_LABELS: Record<Color, string> = {
  red: '赤',
  blue: '青',
  green: '緑',
  yellow: '黄',
  purple: '紫',
  orange: '橙',
  pink: '桃',
  cyan: '水',
  lime: '黄緑',
}

export function AtariGame() {
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
    setState(start(time))
  }

  function handleTapTile(index: number) {
    setState((current) => tapTile(current, index, Date.now()))
  }

  if (state.phase === 'ready') {
    return (
      <div className="atari">
        <p>当たりの色のタイルだけをタップしよう。外れたらそこでゲームオーバー！</p>
        <p>{TIME_LIMIT_SECONDS}秒以内に何回当てられるかな？</p>
        <button className="atari-start" onClick={handleStart}>
          スタート
        </button>
      </div>
    )
  }

  if (state.phase === 'finished') {
    return (
      <div className="atari">
        <p>おしまい！</p>
        <p className="atari-result">{state.score} 回</p>
        <button className="atari-start" onClick={handleStart}>
          もう一回
        </button>
      </div>
    )
  }

  return (
    <div className="atari">
      <p>のこり {remainingSeconds(state, now).toFixed(1)} 秒</p>
      <p className="atari-score">{state.score} 回</p>
      <p className="atari-target">
        当たりは
        <span className={`atari-swatch atari-tile-${state.target}`} />
        <span data-testid="target-label">{COLOR_LABELS[state.target]}</span>
      </p>
      <div className="atari-board">
        {state.tiles.map((color, index) => (
          <button
            key={index}
            type="button"
            className={`atari-tile atari-tile-${color}`}
            aria-label={COLOR_LABELS[color]}
            data-testid={`tile-${index}`}
            onClick={() => handleTapTile(index)}
          />
        ))}
      </div>
    </div>
  )
}
