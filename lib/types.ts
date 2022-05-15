export interface Options {
    help: boolean
    version: boolean
    outDir?: string
  }
  
export type CommandFunction = (args: string[], options: Options) => Promise<void>
  