import { register } from '../../core/registry/registry.ts'
import { AimGame } from './AimGame.tsx'

register({
  id: 'aim',
  title: 'エイム練習',
  author: 'FPSゲーム大好きな作者',
  description: '20秒間に、出てくる的をどれだけ速く正確に当てられるかな？',
  Component: AimGame,
})
