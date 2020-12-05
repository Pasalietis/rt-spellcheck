import Dictionary from './dictionary'
import Affix from '../affix'

const affFile = `SET UTF-8
TRY iastnokreuldvėmgpjšbyžūczfčhąįųęwxq

PFX N Y 1
PFX N 0       nebe            .

SFX T Y 2
SFX T ti      siančioj        [^sšzž]ti
SFX T ti      siančiuoju      [^sšzž]ti

SFX X N 1
SFX X ti      tu              ti

SFX a Y 1
SFX a ti      jo              ti

SFX D Y 1
SFX D as      ą               as
`

const dicFile = `4
klapsėti/NTX
klapsėti/a
namas/D
stalas
`

describe('Dictionary', () => {
  describe('addAffixFile', () => {
    let dict: Dictionary

    beforeEach(() => {
      dict = new Dictionary()

      dict.addAffixFile(affFile)
    })

    it('corectly adds prefixes', () => {
      const expected: Array<Affix> = [
        new Affix({type: 'PFX', code: 'N', remove: 'nebe', add: '', check: '.', combinable: true}),
      ]

      expect(dict.prefixes).toStrictEqual(expected)
    })

    it('corectly adds suffixes', () => {
      const expected: Array<Affix> = [
        new Affix({type: 'SFX', code: 'T', remove: 'siančioj', add: 'ti', check: '[^sšzž]ti', combinable: true}),
        new Affix({type: 'SFX', code: 'T', remove: 'siančiuoju', add: 'ti', check: '[^sšzž]ti', combinable: true}),
        new Affix({type: 'SFX', code: 'X', remove: 'tu', add: 'ti', check: 'ti', combinable: false}),
        new Affix({type: 'SFX', code: 'a', remove: 'jo', add: 'ti', check: 'ti', combinable: true}),
        new Affix({type: 'SFX', code: 'D', remove: 'ą', add: 'as', check: 'as', combinable: true}),
      ]

      expect(dict.suffixes).toStrictEqual(expected)
    })
  })

  describe('addDicFile', () => {
    let dict: Dictionary

    beforeEach(() => {
      dict = new Dictionary()

      dict.addDicFile(dicFile)
    })

    it('combines passes duplicated words', () => {
      const expected = {
        'klapsėti': ['NTX', 'a'],
        namas: ['D'],
        stalas: [],
      }

      expect(dict.words).toStrictEqual(expected)
    })
  })
})
