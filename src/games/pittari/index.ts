import { register } from '../../core/registry/registry.ts'
import { PittariGame } from './PittariGame.tsx'

register({
  id: 'pittari',
  title: 'ぴったりストップ',
  author: 'てってけ',
  description: 'ぴったり止められるかな？',
  Component: PittariGame,
})
