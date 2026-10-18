import { useEffect, useState } from 'react'
import './MemoryGame.css'
import { createState, flip, hideMismatched, isWaiting, start } from './rules.ts'

// ちがう2枚を見せておく時間（ミリ秒）。短すぎると覚えられない
const HIDE_DELAY_MS = 1000

export function MemoryGame() {
  const [state, setState] = useState(createState)
  const waiting = isWaiting(state)

  // ちがう2枚をめくったら、少し待ってから裏にもどす
  useEffect(() => {
    if (!waiting) return
    const timer = setTimeout(() => {
      setState((current) => hideMismatched(current))
    }, HIDE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [waiting])

  function handleStart() {
    setState(start())
  }

  function handleFlip(index: number) {
    setState((current) => flip(current, index))
  }

  if (state.phase === 'ready') {
    return (
      <div className="memory">
        <p>
          同じ文字のカードを2枚ずつそろえよう。少ない回数でぜんぶそろえられるかな？
        </p>
        <button className="memory-start" onClick={handleStart}>
          スタート
        </button>
      </div>
    )
  }

  if (state.phase === 'finished') {
    return (
      <div className="memory">
        <p>ぜんぶそろった！</p>
        <p className="memory-result">{state.moves} 回</p>
        <button className="memory-start" onClick={handleStart}>
          もう一回
        </button>
      </div>
    )
  }

  return (
    <div className="memory">
      <p>めくった回数 {state.moves} 回</p>
      <div className="memory-board">
        {state.cards.map((card, index) => (
          <button
            key={index}
            className={`memory-card${card.faceUp ? ' is-face-up' : ''}${card.matched ? ' is-matched' : ''}`}
            onClick={() => handleFlip(index)}
          >
            {card.faceUp ? card.symbol : '?'}
          </button>
        ))}
      </div>
    </div>
  )
}
