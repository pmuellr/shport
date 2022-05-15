#!/usr/bin/env deno run --allow-read --allow-write

export const VERSION = '0.0.1'

import { logExit1 } from './lib/log.ts'
import { help } from './lib/help.ts'
import { parseArgs } from './lib/parse-args.ts'

import { commands } from './lib/commands/mod.ts'

async function main() {
  const { args, opts } = parseArgs()

  if (opts.version) {
    console.log(VERSION)
    Deno.exit()
  }
  if (args.length === 0) help()
  if (opts.help) help()

  const commandSet = new Set(Object.keys(commands))
  const [command, ...commandArgs] = args

  if (commandSet.has(command)) {
    try {
      await commands[command](commandArgs, opts)
    } catch (err) {
      logExit1(`${command} error: ${err}`)
    }
  } else {
    logExit1(`unknown command "${command}"; commands available: ${Object.keys(commands).join(', ')}`)
  }
}

if (Deno.mainModule === import.meta.url) main()