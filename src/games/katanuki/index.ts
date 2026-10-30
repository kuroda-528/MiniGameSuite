import { register } from '../../core/registry/registry.ts'
import { KatanukiGame } from './KatanukiGame.tsx'

register({
  id: 'katanuki',
  title: '型抜き',
  author: 'ロブロ好きの人', // 本名は書かない
  description: '針で溝をなぞって、割らずに形を抜こう！',
  Component: KatanukiGame,
})
