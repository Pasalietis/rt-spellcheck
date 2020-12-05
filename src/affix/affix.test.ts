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
      expect(affix.add).toBe('as')
      expect(affix.remove).toStrictEqual(/ą$/)
      expect(affix.check).toStrictEqual(/ą$/)
      expect(affix.combinable).toBe(false)
    })
  })

  describe('with type PFX', () => {
    beforeEach(() => {
      affixParameters.type = 'PFX'
    })

    it('correctly parse remove', () => {
      const affix = new Affix({...affixParameters, remove: 'pa'})

      expect(affix.add).toBe('')
      expect(affix.remove).toStrictEqual(/^pa/)
      expect(affix.check).toStrictEqual(/^pa/)
    })

    it('correctly parse check', () => {
      const affix = new Affix({...affixParameters, remove: 'ati', check: '[dt]'})

      expect(affix.add).toBe('')
      expect(affix.remove).toStrictEqual(/^ati/)
      expect(affix.check).toStrictEqual(/^ati[dt]/)
    })

    it('works with regex symbols', () => {
      const affix = new Affix({...affixParameters, remove: 'ati', check: '[^dt]'})

      expect(affix.add).toBe('')
      expect(affix.remove).toStrictEqual(/^ati/)
      expect(affix.check).toStrictEqual(/^ati[^dt]/)
    })

    it('changes remove with add', () => {
      const affix = new Affix({...affixParameters, add: 'ė', remove: 'at', check: 'ėne'})

      expect(affix.add).toBe('ė')
      expect(affix.remove).toStrictEqual(/^at/)
      expect(affix.check).toStrictEqual(/^atne/)
    })
  })

  describe('with type SFX', () => {
    beforeEach(() => {
      affixParameters.type = 'SFX'
    })

    it('correctly parse empty add', () => {
      const affix = new Affix({...affixParameters, remove: 'm', check: 'ė'})

      expect(affix.add).toBe('')
      expect(affix.remove).toStrictEqual(/m$/)
      expect(affix.check).toStrictEqual(/ėm$/)
    })

    it('correctly parse empty check', () => {
      const affix = new Affix({...affixParameters, add: 'ė', remove: 'm'})

      expect(affix.add).toBe('ė')
      expect(affix.remove).toStrictEqual(/m$/)
      expect(affix.check).toStrictEqual(/m$/)
    })

    it('correctly parse empty add and check', () => {
      const affix = new Affix({...affixParameters, remove: 'm'})

      expect(affix.add).toBe('')
      expect(affix.remove).toStrictEqual(/m$/)
      expect(affix.check).toStrictEqual(/m$/)
    })

    it('correctly parse check', () => {
      const affix = new Affix({...affixParameters, add: 'ė', remove: 'iau', check: '[^dt]ė'})

      expect(affix.add).toBe('ė')
      expect(affix.remove).toStrictEqual(/iau$/)
      expect(affix.check).toStrictEqual(/[^dt]iau$/)
    })

    it('correctly parse empty remove', () => {
      const affix = new Affix({...affixParameters, add: 's', check: 'as'})

      expect(affix.add).toBe('s')
      expect(affix.remove).toStrictEqual(/$/)
      expect(affix.check).toStrictEqual(/a$/)
    })
  })
})
