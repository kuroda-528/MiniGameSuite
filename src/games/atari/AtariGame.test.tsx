import { fireEvent, render, screen } from '@testing-library/react'
import { AtariGame } from './AtariGame.tsx'

describe('AtariGame', () => {
  it('スタート → 当たりをタップすると得点が増え、外れをタップした時点でゲームオーバーになり、もう一回で遊び直せる', () => {
    render(<AtariGame />)

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))

    const targetLabel = screen.getByTestId('target-label').textContent
    fireEvent.click(screen.getByRole('button', { name: targetLabel! }))
    expect(screen.getByText('1 回')).toBeInTheDocument()

    const newTargetLabel = screen.getByTestId('target-label').textContent
    const missButton = screen
      .getAllByRole('button')
      .find(
        (button) =>
          button.dataset.testid?.startsWith('tile-') &&
          button.getAttribute('aria-label') !== newTargetLabel,
      )
    fireEvent.click(missButton!)

    expect(screen.getByText('おしまい！')).toBeInTheDocument()
    expect(screen.getByText('1 回')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'もう一回' }))
    expect(screen.getByText('0 回')).toBeInTheDocument()
  })
})
