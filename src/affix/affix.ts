import {PREFIX_TEMPLATE, SUFFIX_TEMPLATE} from './consts'
import {AffixParameters} from './types'

export default class Affix {
  public readonly code: string

  public readonly combinable: boolean

  private readonly add: string

  private readonly remove: RegExp

  private readonly check: RegExp

  public static createByLine(line: string, combinable: boolean): Affix {
    const [type, code, add, remove, check] = Affix.parseAffixLine(line)

    return new Affix({type, code, add, remove, check, combinable})
  }

  public static parseAffixLine(line: string): string[] {
    return line.split(/\s+/)
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

  testWord(word: string): boolean {
    return !!word.match(this.check)
  }

  applyToWord(word: string): string {
    return word.replace(this.remove, this.add)
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
