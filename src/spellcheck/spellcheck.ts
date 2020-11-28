import Dictionary from '../dictionary'

export default class Spellchecker {
  dict: Dictionary

  constructor(language?: string) {
    this.dict = new Dictionary(language)
  }

  check = (aWord: string): boolean => {
    const trimmedWord = aWord.trim()

    if (this.checkExact(trimmedWord)) return true

    if (trimmedWord.toUpperCase() === trimmedWord) {
      const capitalizedWord = trimmedWord[0] + trimmedWord.substring(1).toLowerCase()

      if (this.checkExact(capitalizedWord)) return true
    }

    const lowercaseWord = trimmedWord.toLowerCase()

    return lowercaseWord !== trimmedWord && this.checkExact(lowercaseWord)
  }

  private checkExact = (word: string): boolean => {
    return this.dict.getWord(word)
  }
}
