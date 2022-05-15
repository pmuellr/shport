import { CommandFunction } from '../types.ts'
import { command as compile } from './compile.ts'

export const commands: Record<string, CommandFunction> = {
  compile,
}
