import { act, fireEvent, render, screen } from '@testing-library/react'
import { PittariGame } from './PittariGame.tsx'

describe('PittariGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // 乱数を 0.25 に固定する。1回目は 5 秒、5 秒の次は 4 秒が目標になる
    vi.spyOn(Math, 'random').mockReturnValue(0.25)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('スタート → 4.87秒で止める → 結果が出て、もう一回で遊び直せる', () => {
    render(<PittariGame />)

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    expect(screen.getByText('ねらいは 5 秒！')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(4870)
    })
    fireEvent.click(screen.getByRole('button', { name: 'ストップ！' }))

    expect(screen.getByText('ねらいは 5 秒でした')).toBeInTheDocument()
    expect(screen.getByText('4.87 秒')).toBeInTheDocument()
    expect(screen.getByText('0.13 秒はやい')).toBeInTheDocument()
    expect(screen.getByText('おしい！')).toBeInTheDocument()

    // 止めたあとは時間が進んでも数字が変わらない
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByText('4.87 秒')).toBeInTheDocument()

    // もう一回では、前と違う秒数（4 秒）になる
    fireEvent.click(screen.getByRole('button', { name: 'もう一回' }))
    expect(screen.getByText('0.00 秒')).toBeInTheDocument()
    expect(screen.getByText('ねらいは 4 秒！')).toBeInTheDocument()
  })

  it('ちょうど5秒で止めると「ぴったり！」が出る', () => {
    render(<PittariGame />)

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    fireEvent.click(screen.getByRole('button', { name: 'ストップ！' }))

    expect(screen.getByText('ぴったり！')).toBeInTheDocument()
    expect(screen.getByText('ずれなし')).toBeInTheDocument()
  })

  it('目標が 8 秒のときは、8 秒の近くで止めると良い評価になる', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.7) // 8 秒
    render(<PittariGame />)

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    expect(screen.getByText('ねらいは 8 秒！')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(8100)
    })
    fireEvent.click(screen.getByRole('button', { name: 'ストップ！' }))

    expect(screen.getByText('0.10 秒おそい')).toBeInTheDocument()
    expect(screen.getByText('おしい！')).toBeInTheDocument()
  })
})
