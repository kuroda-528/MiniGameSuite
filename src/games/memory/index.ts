import { register } from '../../core/registry/registry.ts'
import { MemoryGame } from './MemoryGame.tsx'

register({
  id: 'memory',
  title: '神経衰弱',
  author: 'リムルール',
  description: '少ない回数でぜんぶそろえよう！',
  Component: MemoryGame,
})
