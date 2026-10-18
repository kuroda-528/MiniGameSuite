import { act, fireEvent, render, screen } from '@testing-library/react'
import { AimGame } from './AimGame.tsx'

describe('AimGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('スタート → 2回当てて1回外す → 20秒たつと結果が出て、もう一回で遊び直せる', () => {
    render(<AimGame />)

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    fireEvent.click(screen.getByRole('button', { name: '的' }))
    fireEvent.click(screen.getByRole('button', { name: '的' }))
    fireEvent.click(screen.getByTestId('aim-area'))
    expect(screen.getByText('命中 2')).toBeInTheDocument()
    expect(screen.getByText('ミス 1')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(20_100)
    })
    expect(screen.getByText('おしまい！')).toBeInTheDocument()
    expect(screen.getByText('2 個命中')).toBeInTheDocument()
    expect(screen.getByText('命中率 67%')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'もう一回' }))
    expect(screen.getByText('命中 0')).toBeInTheDocument()
    expect(screen.getByText('ミス 0')).toBeInTheDocument()
  })
})
