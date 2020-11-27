import {readFileSync} from 'fs'
import {join} from 'path'
import {Afx, AfxRules} from './types'
import {getPFXRules, getSFXRules, parseLine} from './utils'

export default class Dictionary {
  private readonly pfx: Array<Afx> = []

  private readonly sfx: Array<Afx> = []

  private readonly words: Record<string, string> = {}

  constructor(language: string) {
    this.parse(language)
  }

  private parse = (langauge: string) => {
    const base = require.resolve(`dictionary-${langauge}`).replace(/index\.js$/, '')

    const aff = readFileSync(join(base, 'index.aff'))
    const dic = readFileSync(join(base, 'index.dic'))

    if (!aff && !dic) throw new Error('Invalid dictionary to parse')

    this.parseAFF(`${aff}`)
    this.parseDic(`${dic}`)
  }

  private parseAFF = (data: string) => {
    const lines = this.removeAffixComments(data).split('\n')

    for (let i = 2; i < lines.length; i++) {
      const [type, code, combinableStr, sequenceStr] = parseLine(lines[i])

      const sequence = Number(sequenceStr)
      const combinable = combinableStr === 'Y'

      if (Number.isNaN(sequence)) throw new Error('Unable to parse *.aff file: out of sequence')

      for (let j = 1; j <= sequence; j++) {
        const [, afxCode, remove, add, check] = parseLine(lines[i + j])

        if (code !== afxCode) throw new Error('Unable to parse *.aff file: out of sequence')

        let target: Array<Afx>
        let rules: AfxRules

        if (type === 'PFX') {
          rules = getPFXRules(remove, add, check)
          target = this.pfx
        } else if (type === 'SFX') {
          rules = getSFXRules(remove, add, check)
          target = this.sfx
        } else {
          throw new Error('Corrupted *.aff file')
        }

        target.push({
          code,
          combinable,
          ...rules,
        })
      }

      i += sequence
    }
  }

  private removeAffixComments = (data: string) => {
    // Remove comments
    data = data.replace(/#.*$/mg, '')

    // Trim each line
    data = data.replace(/^\s\s*/m, '').replace(/\s\s*$/m, '')

    // Remove blank lines.
    data = data.replace(/\n{2,}/g, '\n')

    // Trim the entire string
    return data.trim()
  }

  private parseDic = (data: string) => {
    const lines = this.removeDicComments(data).split('\n')

    lines.slice(1).forEach((line) => {
      const [word, codes] = line.split('/', 2)

      this.words[word] = codes || ''
    })
  }

  private removeDicComments = (data: string) => {
    // I can't find any official documentation on it, but at least the de_DE
    // dictionary uses tab-indented lines as comments.

    return data.replace(/^\t.*$/mg, '')
  }

  getWord = (word: string): boolean => this.wordExists(word) || this.checkByPFX(word) || this.checkBySFX(word)

  private wordExists = (word: string, code?: string): boolean => word in this.words && (!code || this.words[word].includes(code))

  private checkByPFX = (word: string): boolean => {
    const len = this.pfx.length

    for (let i = 0; i < len; i++) {
      const aff = this.pfx[i]

      if (word.match(aff.check)) {
        const affWord = word.replace(aff.remove, aff.add)

        if (this.wordExists(affWord, aff.code)) return true
        if (aff.combinable && this.checkBySFX(word, aff.code)) return true
      }
    }

    return false
  }

  private checkBySFX = (word: string, code?: string): boolean => {
    const len = this.sfx.length

    for (let i = 0; i < len; i++) {
      const aff = this.sfx[i]

      if ((!code || (aff.combinable && aff.code === code)) && word.match(aff.check)) {
        const affWord = word.replace(aff.remove, aff.add)

        if (this.wordExists(affWord, aff.code)) return true
      }
    }

    return false
  }
}
