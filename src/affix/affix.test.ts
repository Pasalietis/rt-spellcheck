import {AffixParameters} from './types'
import Affix from './affix'

describe('Affix', () => {
  let affixParameters: AffixParameters

  beforeEach(() => {
    affixParameters = {
      type: '',
      combinable: true,
      code: 'A',
      add: '0',
      remove: '0',
      check: '.',
    }
  })

  describe('createByLine', () => {
    it('parses correctly', () => {
      const affix = Affix.createByLine('SFX D as      ą               as', false)

      expect(affix.code).toBe('D')
      expect(affix.combinable).toBeFalsy()
      expect(affix.testWord('stalas')).toBeFalsy()
      expect(affix.testWord('stalą')).toBeTruthy()
      expect(affix.applyToWord('stalą')).toBe('stalas')
    })
  })

  describe('createByLine', () => {
    it('parses correctly', () => {
      const expected = ['SFX', 'D', 'as', 'ą', 'as']
      const result = Affix.parseAffixLine('SFX D as      ą               as')

      expect(result).toStrictEqual(expected)
    })
  })

  describe('with type PFX', () => {
    beforeEach(() => {
      affixParameters.type = 'PFX'
    })

    it('correctly parse remove', () => {
      const affix = new Affix({...affixParameters, remove: 'pa'})

      expect(affix.testWord('foo')).toBeFalsy()
      expect(affix.testWord('pafoo')).toBeTruthy()

      expect(affix.applyToWord('pafoo')).toBe('foo')
    })

    it('correctly parse check', () => {
      const affix = new Affix({...affixParameters, remove: 'ati', check: '[dt]'})

      expect(affix.testWord('foo')).toBeFalsy()
      expect(affix.testWord('atifoo')).toBeFalsy()
      expect(affix.testWord('atidfoo')).toBeTruthy()
      expect(affix.testWord('atitfoo')).toBeTruthy()

      expect(affix.applyToWord('atidfoo')).toBe('dfoo')
      expect(affix.applyToWord('atitbar')).toBe('tbar')
    })

    it('works with regex symbols', () => {
      const affix = new Affix({...affixParameters, remove: 'ati', check: '[^dt]'})

      expect(affix.testWord('foo')).toBeFalsy()
      expect(affix.testWord('atifoo')).toBeTruthy()
      expect(affix.testWord('atidfoo')).toBeFalsy()
      expect(affix.testWord('atitfoo')).toBeFalsy()

      expect(affix.applyToWord('atifoo')).toBe('foo')
    })

    it('changes remove with add', () => {
      const affix = new Affix({...affixParameters, add: 'ė', remove: 'at', check: 'ėne'})

      expect(affix.testWord('foo')).toBeFalsy()
      expect(affix.testWord('atfoo')).toBeFalsy()
      expect(affix.testWord('ėnefoo')).toBeFalsy()
      expect(affix.testWord('nefoo')).toBeFalsy()
      expect(affix.testWord('atnefoo')).toBeTruthy()

      expect(affix.applyToWord('atnefoo')).toBe('ėnefoo')
    })
  })

  describe('with type SFX', () => {
    beforeEach(() => {
      affixParameters.type = 'SFX'
    })

    it('correctly parse empty add', () => {
      const affix = new Affix({...affixParameters, remove: 'm', check: 'ė'})

      expect(affix.testWord('foo')).toBeFalsy()
      expect(affix.testWord('foom')).toBeFalsy()
      expect(affix.testWord('fooėm')).toBeTruthy()

      expect(affix.applyToWord('fooėm')).toBe('fooė')
    })

    it('correctly parse empty check', () => {
      const affix = new Affix({...affixParameters, add: 'ė', remove: 'm'})

      expect(affix.testWord('foo')).toBeFalsy()
      expect(affix.testWord('fooė')).toBeFalsy()
      expect(affix.testWord('foom')).toBeTruthy()

      expect(affix.applyToWord('foom')).toBe('fooė')
    })

    it('correctly parse empty add and check', () => {
      const affix = new Affix({...affixParameters, remove: 'm'})

      expect(affix.testWord('foo')).toBeFalsy()
      expect(affix.testWord('foom')).toBeTruthy()

      expect(affix.applyToWord('foom')).toBe('foo')
    })

    it('correctly parse check', () => {
      const affix = new Affix({...affixParameters, add: 'ė', remove: 'iau', check: '[^dt]ė'})

      expect(affix.testWord('foo')).toBeFalsy()
      expect(affix.testWord('fooiau')).toBeTruthy()
      expect(affix.testWord('foodiau')).toBeFalsy()
      expect(affix.testWord('footiau')).toBeFalsy()

      expect(affix.applyToWord('fooiau')).toBe('fooė')
    })

    it('correctly parse empty remove', () => {
      const affix = new Affix({...affixParameters, add: 's', check: 'as'})

      expect(affix.testWord('foo')).toBeFalsy()
      expect(affix.testWord('fooa')).toBeTruthy()
      expect(affix.testWord('fooas')).toBeFalsy()
      expect(affix.testWord('foos')).toBeFalsy()

      expect(affix.applyToWord('fooa')).toBe('fooas')
    })
  })
})
