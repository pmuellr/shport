// @ts-ignore
import { Runtime, Inspector, Library } from '@observablehq/runtime'

export const library = {
  ...new Library(),
  FileAttachment: fileAttachmentReplacement,
}

export const runtime = new Runtime(library)
  
const inspectorFactory = Inspector.into('body')
const modjewel = runtime.module()

let hidden = false

/** @type { (uri: string) => any } */
function fileAttachmentReplacement (uri) {
  return runtime.fileAttachments(s => s)
}

export function hide() {
  hidden = true
}

export function show() {
  hidden = false
}

/** @type { (f: any) => void } */
export function variable(f) {
  if (f == null) throw new Error('variable() requires a non-null argument')

  const params = []
  if (typeof f === 'function') {
    params.push(...getFnParams(f))
  }

  const name = f.name || null

  const inspector = hidden ? undefined : inspectorFactory()
  const varjewel = modjewel.variable(inspector)
  varjewel.define(name, params, f)
}

/** @type { (f: Function) => void } */
export function viewOf(f) {
  if (typeof f !== 'function' || !f.name) throw new Error('viewOf() requires a named function')
  const params = getFnParams(f)
  const viewName = `${f.name}_view`

  const variable = modjewel.variable()
  const viewVariable = modjewel.variable(inspectorFactory())

  viewVariable.define(viewName, params, f)
  variable.define(
    f.name, 
    [ 'Generators', viewName ], 
    (Generators, viewVariable) => Generators.input(viewVariable)
  )
}

/** @type { (s: string) => void } */
export function md(s) { variable((md) => md`${s}`) }

/** @type { (s: string) => void } */
export function html(s) { variable((html) => html`${s}`) }

/** @type { (s: string) => void } */
export function svg(s) { variable((svg) => svg`${s}`) }

/** @type { (s: string) => void } */
export function tex(s) { variable((tex) => tex`${s}`) }

tex.block = function tex_block(s) {
  variable((tex) => tex.block`${s}`)
}

/** @type { (...args: string[]) => any } */
export const require = library.require

/** @type { (fn: Function) => string[] } */
function getFnParams (fn) {
    const fnString = `${fn}`.replace(/\n/g, ' ')
    const match = fnString.match(/.*?\((.*?)\)/)
    if (match == null) throw new Error(`expecting parenthesized parameters for function ${fn}`)

    const params = match[1]
      .split(/,/g)
      .map(param => param.trim())
  
    if (params.length === 1 && params[0] === '') {
      return []
    }
    return params
  }
  
  