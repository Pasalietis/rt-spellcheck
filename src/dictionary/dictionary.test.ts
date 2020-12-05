import Dictionary from './dictionary'

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

    it('correctly adds prefixes', () => {
      expect(dict.prefixes).toHaveLength(1)
      expect(dict.prefixes[0].code).toBe('N')
      expect(dict.prefixes[0].combinable).toBeTruthy()
    })

    it('correctly adds suffixes', () => {
      expect(dict.suffixes).toHaveLength(5)

      expect(dict.suffixes[0].code).toBe('T')
      expect(dict.suffixes[0].combinable).toBeTruthy()

      expect(dict.suffixes[1].code).toBe('T')
      expect(dict.suffixes[1].combinable).toBeTruthy()

      expect(dict.suffixes[2].code).toBe('X')
      expect(dict.suffixes[2].combinable).toBeFalsy()

      expect(dict.suffixes[3].code).toBe('a')
      expect(dict.suffixes[3].combinable).toBeTruthy()

      expect(dict.suffixes[4].code).toBe('D')
      expect(dict.suffixes[4].combinable).toBeTruthy()
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
