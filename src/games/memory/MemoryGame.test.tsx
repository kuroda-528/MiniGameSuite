import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryGame } from './MemoryGame.tsx'

describe('MemoryGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // シャッフルで並びが変わらないようにする（A, A, B, B, ... の順になる）
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('スタートすると16枚のカードが裏向きで出る', () => {
    render(<MemoryGame />)
    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    expect(screen.getAllByRole('button', { name: '?' })).toHaveLength(16)
    expect(screen.getByText('めくった回数 0 回')).toBeInTheDocument()
  })

  it('ちがう2枚は1秒後に裏にもどり、ぜんぶそろえると結果が出て、もう一回で遊び直せる', () => {
    render(<MemoryGame />)
    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    const cards = screen.getAllByRole('button')

    // A と B をめくる → ちがうので、1秒後に裏にもどる
    fireEvent.click(cards[0])
    fireEvent.click(cards[2])
    expect(screen.getByText('めくった回数 1 回')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getAllByRole('button', { name: '?' })).toHaveLength(16)

    // 2枚ずつそろえていく
    for (let i = 0; i < 16; i += 2) {
      fireEvent.click(cards[i])
      fireEvent.click(cards[i + 1])
    }
    expect(screen.getByText('ぜんぶそろった！')).toBeInTheDocument()
    expect(screen.getByText('9 回')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'もう一回' }))
    expect(screen.getByText('めくった回数 0 回')).toBeInTheDocument()
  })
})
