
import { path } from './deps.ts'

export const PROGRAM = path.basename(Deno.mainModule).replace(/\.ts$/, '')

export function log(message: string) {
  console.log(`${PROGRAM}: ${message}`)
}

export function logExit1(message: string) {
  log(message)
  Deno.exit(1)
}