import { register } from '../../core/registry/registry.ts'
import { StopGame } from './StopGame.tsx'

register({
  id: 'stop',
  title: 'ぴったりストップ',
  author: 'tamaya',
  description: '動くバーを真ん中でぴったり止めよう！',
  Component: StopGame,
})
