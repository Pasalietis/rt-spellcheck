import {readFileSync} from 'fs'
import {join} from 'path'

import Affix from '../affix'
import {removeAffixComments, removeDicComments} from './utils'

export default class Dictionary {
  readonly prefixes: Array<Affix> = []

  readonly suffixes: Array<Affix> = []

  readonly words: Record<string, Array<string>> = {}

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
      const [type, code, combinableStr, sequenceStr] = Affix.parseAffixLine(lines[i])

      const sequence = Number(sequenceStr)
      const combinable = combinableStr === 'Y'

      if (Number.isNaN(sequence)) throw new Error('Unable to parse *.aff file: out of sequence')

      for (let j = 1; j <= sequence; j++) {
        const affix = Affix.createByLine(lines[i + j], combinable)

        if (code !== affix.code) throw new Error('Unable to parse *.aff file: out of sequence')

        if (type === 'PFX') {
          this.prefixes.push(affix)
        } else if (type === 'SFX') {
          this.suffixes.push(affix)
        } else {
          throw new Error(`Unknown aff type: ${type}`)
        }
      }

      i += sequence
    }
  }

  addDicFile = (data: string | Buffer): void => {
    const lines = removeDicComments(`${data}`).split('\n')

    lines.slice(1).forEach((line) => {
      const [word, codes] = line.split('/', 2)

      if (!word) return
      if (!this.words[word]) this.words[word] = []
      if (!codes) return

      this.words[word].push(codes)
    })
  }
}
