import {AfxRules} from './types'

export function parseLine(line: string): string[] {
  return line.split(/\s+/)
}

function formatAdd(add: string): string {
  return add === '0' ? '' : add
}

export function getPFXRules(add: string, remove: string, check: string): AfxRules {
  const removeRegexp = new RegExp(`^${remove}`)
  const checkRegexp = check === '.' ? removeRegexp : new RegExp(`^${remove}${check.replace(new RegExp(`^${add}`), '')}`)

  return {
    add: formatAdd(add),
    remove: removeRegexp,
    check: checkRegexp,
  }
}

export function getSFXRules(add: string, remove: string, check: string): AfxRules {
  const removeRegexp = new RegExp(`${remove}$`)
  const checkRegexp = check === '.' ? removeRegexp : new RegExp(`${check.replace(new RegExp(`${add}$`), '')}${remove}$`)

  return {
    add: formatAdd(add),
    remove: removeRegexp,
    check: checkRegexp,
  }
}
