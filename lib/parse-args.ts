#!/usr/bin/env deno run --allow-env --allow-read

import { log } from './log.ts'
import { flags } from './deps.ts'
import { Options } from './types.ts'

export function parseArgs(): { args: string[], opts: Options } {
  const unknownOptions: string[] = []

  const parsed = flags.parse(Deno.args, {
    string: split(''),
    boolean: split('help version'),
    alias: {
      h: 'help',
      o: 'out-dir',
    },
    default: {
      help: false,
      version: false,
      'out-dir': undefined,
    },
    unknown: (option: string ) => {
      if (option.startsWith('-')) {
        unknownOptions.push(option)
      }
    }
  })

  if (unknownOptions.length > 0) {
    log(`unknown options ignored: ${unknownOptions.join(', ')}`)
  }

  const args = parsed._.map(arg => `${arg}`)
  return { 
    args, 
    opts: {
      help: parsed.help,
      version: parsed.version,
      outDir: parsed['out-dir'],
    }
  }
}


function split(string: string) {
  return string.trim().split(/\W+/g)
}

function test() {
  log(`"${Deno.args.join(' ')}" -> test: ${JSON.stringify(parseArgs())}`)
}

if (Deno.mainModule === import.meta.url) test()