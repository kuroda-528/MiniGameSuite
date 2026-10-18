import { register } from '../../core/registry/registry.ts'
import { AtariGame } from './AtariGame.tsx'

register({
  id: 'atari',
  title: '反射神経チェック',
  author: 'IKA',
  description: '当たりの色のタイルを、時間内にいくつタップできるかな？',
  Component: AtariGame,
})
