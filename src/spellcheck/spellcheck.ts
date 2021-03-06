import Dictionary from '../dictionary'
import WordCheck from '../word-check'

export default class Spellchecker {
  dict: Dictionary

  private readonly wordCheck: WordCheck

  constructor(language?: string) {
    this.dict = new Dictionary(language)
    this.wordCheck = new WordCheck(this.dict)
  }

  check = (aWord: string): boolean => {
    const trimmedWord = aWord.replace(/\u00AD/g, '').trim()

    if (this.checkExact(trimmedWord)) return true

    if (trimmedWord.toUpperCase() === trimmedWord) {
      const capitalizedWord = trimmedWord[0] + trimmedWord.substring(1).toLowerCase()

      if (this.checkExact(capitalizedWord)) return true
    }

    const lowercaseWord = trimmedWord.toLowerCase()

    return lowercaseWord !== trimmedWord && this.checkExact(lowercaseWord)
  }

  private checkExact = (word: string): boolean => this.wordCheck.check(word)
}
