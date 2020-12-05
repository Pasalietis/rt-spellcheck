import Dictionary from '../dictionary'

export default class WordCheck {
  private readonly dictionary: Dictionary

  constructor(dictionary: Dictionary) {
    this.dictionary = dictionary
  }

  check = (word: string): boolean => this.wordExists(word) || this.checkByPFX(word) || this.checkBySFX(word)

  private wordExists = (word: string, codes?: string): boolean => {
    const wordCodes = this.dictionary.words[word]

    if (!wordCodes) return false
    if (!codes) return true

    for (let i = 0; i < wordCodes.length; i++) {
      let isValid = true

      for (let j = 0; j < codes.length && isValid; j++) {
        if (!wordCodes[i].includes(codes[j])) isValid = false
      }

      if (isValid) return true
    }

    return false
  }

  private checkByPFX = (word: string): boolean => {
    const len = this.dictionary.prefixes.length

    for (let i = 0; i < len; i++) {
      const aff = this.dictionary.prefixes[i]

      if (word.match(aff.check)) {
        const affWord = word.replace(aff.remove, aff.add)

        if (this.wordExists(affWord, aff.code)) return true
        if (aff.combinable && this.checkBySFX(affWord, aff.code)) return true
      }
    }

    return false
  }

  private checkBySFX = (word: string, code?: string): boolean => {
    const len = this.dictionary.suffixes.length

    for (let i = 0; i < len; i++) {
      const aff = this.dictionary.suffixes[i]

      if ((!code || aff.combinable) && word.match(aff.check)) {
        const affWord = word.replace(aff.remove, aff.add)

        if (this.wordExists(affWord, `${code || ''}${aff.code}`)) return true
      }
    }

    return false
  }
}
