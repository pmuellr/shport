import { log } from '../log.ts'
import { Options } from '../types.ts'
import { path } from '../deps.ts'

// deno-lint-ignore require-await
export async function command(files: string[], options: Options): Promise<void> {
  log(`in compile command: ${files.join(', ')} options: ${JSON.stringify(options)}}`)
  for (const file of files) {
    compileFile(file, options)
  }
}


// deno-lint-ignore require-await
async function compileFile(fileName: string, options: Options): Promise<void> {
  const outputFile = getOutputFileName(fileName, options)
  log(`output file: ${outputFile}`)
}

function getOutputFileName(inputFileName: string, options: Options): string {
  return path.join(
    getOutputDirName(inputFileName, options), 
    getOutputBaseName(inputFileName), 
  )
}

function getOutputBaseName(inputFileName: string): string {
  const basename = path.basename(inputFileName)
  const result = basename.replace(/\.[^.]*$/, '') + '.html'
  if (basename === result) {
    throw new Error(`invalid base for input file name: ${basename}`)
  }
  return result
}

function getOutputDirName(inputFileName: string, options: Options): string {
  if (options.outDir) return options.outDir

  return path.dirname(inputFileName)
}
  