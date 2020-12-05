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
      const afx = this.dictionary.prefixes[i]

      if (word.match(afx.check)) {
        const afxWord = word.replace(afx.remove, afx.add)

        if (this.wordExists(afxWord, afx.code)) return true

        if (afx.combinable && this.checkBySFX(afxWord, afx.code)) return true
      }
    }

    return false
  }

  private checkBySFX = (word: string, code?: string): boolean => {
    const len = this.dictionary.suffixes.length

    for (let i = 0; i < len; i++) {
      const afx = this.dictionary.suffixes[i]

      if ((!code || afx.combinable) && word.match(afx.check)) {
        const afxWord = word.replace(afx.remove, afx.add)

        if (this.wordExists(afxWord, `${code || ''}${afx.code}`)) return true
      }
    }

    return false
  }
}
