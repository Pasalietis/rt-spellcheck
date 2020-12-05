import {PREFIX_TEMPLATE, SUFFIX_TEMPLATE} from './consts'
import {AffixParameters} from './types'

export default class Affix {
  public readonly code: string

  public readonly add: string

  public readonly remove: RegExp

  public readonly check: RegExp

  public readonly combinable: boolean

  public static createByLine(line: string, combinable: boolean): Affix {
    const [type, code, add, remove, check] = Affix.parseAffixLine(line)

    return new Affix({type, code, add, remove, check, combinable})
  }

  constructor({type, code, add, remove, check, combinable}: AffixParameters) {
    const template = Affix.getTemplateByType(type)

    if (add === '0') add = ''
    if (remove === '0') remove = ''

    this.code = code
    this.add = add
    this.combinable = combinable

    this.remove = Affix.insertValuesToTemplate(template, remove)
    this.check = this.remove

    if (check === '.') return

    this.check = Affix.insertValuesToTemplate(template, remove, check.replace(Affix.insertValuesToTemplate(template, add), ''))
  }

  public static parseAffixLine(line: string): string[] {
    return line.split(/\s+/)
  }

  private static getTemplateByType(type: string): string {
    if (type === 'PFX') return PREFIX_TEMPLATE
    if (type === 'SFX') return SUFFIX_TEMPLATE

    return ''
  }

  private static insertValuesToTemplate(template: string, value1: string, value2 = ''): RegExp {
    return new RegExp(template.replace('#1', value1).replace('#2', value2))
  }
}
