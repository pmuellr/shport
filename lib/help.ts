
import { PROGRAM } from './log.ts'

export function help() {
  console.log(HELP)
  Deno.exit(1)
}

const HELP = `
${PROGRAM} - Simple Html Pages for the Observable RunTime

usage:

  ${PROGRAM} compile <options> <file> ...
  compiles .shport files to .html files

options:
  -h --help     print help
     --version  print version
  -o --out-dir  directory where output files will be written
                defaults to directory of input file
`.trim()