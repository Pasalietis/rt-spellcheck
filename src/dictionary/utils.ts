import {AfxRules} from './types'

export function removeAffixComments(data: string): string {
  // Remove comments
  data = data.replace(/#.*$/mg, '')

  // Trim each line
  data = data.replace(/^\s\s*/m, '').replace(/\s\s*$/m, '')

  // Remove blank lines.
  data = data.replace(/\n{2,}/g, '\n')

  // Trim the entire string
  return data.trim()
}

export function parseAffixLine(line: string): string[] {
  return line.split(/\s+/)
}

function formatAffixAdd(add: string): string {
  return add === '0' ? '' : add
}

export function getPFXRules(add: string, remove: string, check: string): AfxRules {
  const removeRegexp = new RegExp(`^${remove}`)
  const checkRegexp = check === '.' ? removeRegexp : new RegExp(`^${remove}${check.replace(new RegExp(`^${add}`), '')}`)

  return {
    add: formatAffixAdd(add),
    remove: removeRegexp,
    check: checkRegexp,
  }
}

export function getSFXRules(add: string, remove: string, check: string): AfxRules {
  const removeRegexp = new RegExp(`${remove}$`)
  const checkRegexp = check === '.' ? removeRegexp : new RegExp(`${check.replace(new RegExp(`${add}$`), '')}${remove}$`)

  return {
    add: formatAffixAdd(add),
    remove: removeRegexp,
    check: checkRegexp,
  }
}

export function removeDicComments(data: string): string {
  // I can't find any official documentation on it, but at least the de_DE
  // dictionary uses tab-indented lines as comments.

  return data.replace(/^\t.*$/mg, '')
}
