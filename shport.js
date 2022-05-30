// @ts-ignore
import { Runtime, Inspector, Library } from 'https://cdn.jsdelivr.net/npm/@observablehq/runtime@4.18.7/dist/runtime.js'

const library = {
  ...new Library(),
}
const runtime = new Runtime(library)
  
const inspectorFactory = Inspector.into('body')
const modjewel = runtime.module()

/** @type { (f: any) => void } */
export function variable(f) {
  const params = []
  if (typeof f === 'function') {
    params.push(...getFnParams(f))
  }

  const name = f.name || null

  const varjewel = modjewel.variable(inspectorFactory())
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
export function md(s) {
    variable((md) => md`${s}`)
}

/** @type { (s: string) => void } */
export function html(s) {
    variable((html) => html`${s}`)
}

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
  
  