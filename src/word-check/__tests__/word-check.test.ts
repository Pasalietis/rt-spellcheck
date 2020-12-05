import WordCheck from '../word-check'
import Dictionary from '../../dictionary'

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
  let wordCheck: WordCheck

  beforeEach(() => {
    const dict = new Dictionary()
    dict.addAffixFile(affFile)
    dict.addDicFile(dicFile)

    wordCheck = new WordCheck(dict)
  })

  describe('check', () => {
    it('find simple word', () => {
      expect(wordCheck.check('namas')).toBeTruthy()
    })

    it('find word with UTF-8', () => {
      expect(wordCheck.check('klapsėti')).toBeTruthy()
    })

    it('applies suffix', () => {
      expect(wordCheck.check('namą')).toBeTruthy()
    })

    it('applies only assigned suffix', () => {
      expect(wordCheck.check('stalą')).toBeFalsy()
    })

    it('applies suffix with multipile rules', () => {
      expect(wordCheck.check('klapsėsiančioj')).toBeTruthy()
    })

    it('combines prefix with sufix', () => {
      expect(wordCheck.check('nebeklapsėsiančiuoju')).toBeTruthy()
    })

    it('do not combines if sufix is not combinable', () => {
      expect(wordCheck.check('klapsėtu')).toBeTruthy()
      expect(wordCheck.check('nebeklapsėti')).toBeTruthy()
      expect(wordCheck.check('nebeklapsėtu')).toBeFalsy()
    })

    it('finds only unexsisting word', () => {
      expect(wordCheck.check('kempiniukas')).toBeFalsy()
    })

    it('allows multiple definitions for same words but do no mix them', () => {
      expect(wordCheck.check('klapsėjo')).toBeTruthy()
      expect(wordCheck.check('nebeklapsėjo')).toBeFalsy()
    })
  })
})
