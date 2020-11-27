import {getPFXRules, getSFXRules, parseLine} from './utils'
import {AfxRules} from './types'

describe('parseLine', () => {
  it('parses correctly', () => {
    const data = 'SFX D as      ą               as'
    const expected = ['SFX', 'D', 'as', 'ą', 'as']
    const result = parseLine(data)

    expect(result).toStrictEqual(expected)
  })
})

describe('getPFXRules', () => {
  it('correctly parse 0', () => {
    const expected: AfxRules = {
      add: '',
      remove: new RegExp('^pa'),
      check: new RegExp('^pa'),
    }

    const result = getPFXRules('0', 'pa', '.')

    expect(result).toStrictEqual(expected)
  })

  it('correctly parse check', () => {
    const expected: AfxRules = {
      add: '',
      remove: new RegExp('^ati'),
      check: new RegExp('^ati[dt]'),
    }

    const result = getPFXRules('0', 'ati', '[dt]')

    expect(result).toStrictEqual(expected)
  })

  it('works with regex symbols', () => {
    const expected: AfxRules = {
      add: '',
      remove: new RegExp('^ati'),
      check: new RegExp('^ati[^dt]'),
    }

    const result = getPFXRules('0', 'ati', '[^dt]')

    expect(result).toStrictEqual(expected)
  })

  it('changes remove with add', () => {
    const expected: AfxRules = {
      add: 'ė',
      remove: new RegExp('^at'),
      check: new RegExp('^atne'),
    }

    const result = getPFXRules('ė', 'at', 'ėne')

    expect(result).toStrictEqual(expected)
  })
})

describe('getSFXRules', () => {
  it('correctly parse 0', () => {
    const expected: AfxRules = {
      add: '',
      remove: new RegExp('m$'),
      check: new RegExp('ėm$'),
    }

    const result = getSFXRules('0', 'm', 'ė')

    expect(result).toStrictEqual(expected)
  })

  it('correctly parse .', () => {
    const expected: AfxRules = {
      add: 'ė',
      remove: new RegExp('m$'),
      check: new RegExp('m$'),
    }

    const result = getSFXRules('ė', 'm', '.')

    expect(result).toStrictEqual(expected)
  })

  it('correctly parse 0 and .', () => {
    const expected: AfxRules = {
      add: '',
      remove: new RegExp('m$'),
      check: new RegExp('m$'),
    }

    const result = getSFXRules('0', 'm', '.')

    expect(result).toStrictEqual(expected)
  })

  it('correctly parse check', () => {
    const expected: AfxRules = {
      add: 'ė',
      remove: new RegExp('iau$'),
      check: new RegExp('[^dt]iau$'),
    }

    const result = getSFXRules('ė', 'iau', '[^dt]ė')

    expect(result).toStrictEqual(expected)
  })
})
