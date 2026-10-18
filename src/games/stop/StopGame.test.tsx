import { act, fireEvent, render, screen } from '@testing-library/react'
import { StopGame } from './StopGame.tsx'

describe('StopGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('スタート → ストップ → 点数が出て、もう一回で遊び直せる', () => {
    render(<StopGame />)

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    fireEvent.click(screen.getByRole('button', { name: 'ストップ！' }))

    expect(screen.getByText('おしまい！')).toBeInTheDocument()
    expect(screen.getByText(/^\d+ 点$/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'もう一回' }))
    expect(
      screen.getByRole('button', { name: 'ストップ！' }),
    ).toBeInTheDocument()
  })
})
