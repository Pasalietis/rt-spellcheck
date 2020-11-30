import Dictionary from '../dictionary'

const affFile = `SET UTF-8
TRY iastnokreuldvėmgpjšbyžūczfčhąįųęwxq

PFX N Y 1
PFX N 0       nebe            .

SFX T Y 2
SFX T ti      siančioj        [^sšzž]ti
SFX T ti      siančiuoju      [^sšzž]ti

SFX X N 1
SFX X ti      tu              ti

SFX D Y 1
SFX D as      ą               as
`

const dicFile = `4
klapsėti/NT
klapsėti/X
namas/D
stalas
`

describe('Dictionary', () => {
  let dict: Dictionary

  beforeEach(() => {
    dict = new Dictionary()
    dict.addAffixFile(affFile)
    dict.addDicFile(dicFile)
  })

  describe('getWord', () => {
    it('find simple word', () => {
      expect(dict.getWord('namas')).toBeTruthy()
    })

    it('find word with UTF-8', () => {
      expect(dict.getWord('klapsėti')).toBeTruthy()
    })

    it('applies suffix', () => {
      expect(dict.getWord('namą')).toBeTruthy()
    })

    it('applies only assigned suffix', () => {
      expect(dict.getWord('stalą')).toBeFalsy()
    })

    it('applies suffix with multipile rules', () => {
      expect(dict.getWord('klapsėsiančioj')).toBeTruthy()
    })

    it('combines prefix with sufix', () => {
      expect(dict.getWord('nebeklapsėsiančiuoju')).toBeTruthy()
    })

    it('do not combines if sufix is not combinable', () => {
      expect(dict.getWord('klapsėtu')).toBeTruthy()
      expect(dict.getWord('nebeklapsėti')).toBeTruthy()
      expect(dict.getWord('nebeklapsėtu')).toBeFalsy()
    })

    it('finds only unexsisting word', () => {
      expect(dict.getWord('kempiniukas')).toBeFalsy()
    })
  })
})
