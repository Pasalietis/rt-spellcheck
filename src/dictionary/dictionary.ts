import {readFileSync} from 'fs'
import {join} from 'path'
import {Afx, AfxRules} from './types'
import {getPFXRules, getSFXRules, parseAffixLine, removeAffixComments, removeDicComments} from './utils'

export default class Dictionary {
  private readonly pfx: Array<Afx> = []

  private readonly sfx: Array<Afx> = []

  private readonly words: Record<string, string> = {}

  constructor(language?: string) {
    if (language) this.loadDictionary(language)
  }

  loadDictionary = (language: string): void => {
    const dicPackage = `dictionary-${language}`
    const base = require.resolve(dicPackage).replace(/index\.js$/, '')

    const aff = readFileSync(join(base, 'index.aff'))
    const dic = readFileSync(join(base, 'index.dic'))

    if (!aff && !dic) throw new Error(`Unable to load dictionary: ${dicPackage}`)

    this.addAffixFile(aff)
    this.addDicFile(dic)
  }

  addAffixFile = (data: string | Buffer): void => {
    const lines = removeAffixComments(`${data}`).split('\n')

    for (let i = 2; i < lines.length; i++) {
      const [type, code, combinableStr, sequenceStr] = parseAffixLine(lines[i])

      const sequence = Number(sequenceStr)
      const combinable = combinableStr === 'Y'

      if (Number.isNaN(sequence)) throw new Error('Unable to parse *.aff file: out of sequence')

      for (let j = 1; j <= sequence; j++) {
        const [, afxCode, remove, add, check] = parseAffixLine(lines[i + j])

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

  addDicFile = (data: string | Buffer): void => {
    const lines = removeDicComments(`${data}`).split('\n')

    lines.slice(1).forEach((line) => {
      const [word, codes] = line.split('/', 2)

      this.words[word] = codes || ''
    })
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
