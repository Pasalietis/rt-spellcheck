# Real Time Spellchecker in Javascript

[![Version](https://img.shields.io/npm/v/rt-spellcheck.svg?style=flat-square)](https://www.npmjs.com/package/rt-spellcheck?activeTab=versions)
[![Downloads](https://img.shields.io/npm/dt/rt-spellcheck.svg?style=flat-square)](https://www.npmjs.com/package/rt-spellcheck)
[![Last commit](https://img.shields.io/github/last-commit/Pasalietis/rt-spellcheck.svg?style=flat-square)](https://github.com/Pasalietis/rt-spellcheck/graphs/commit-activity)

A lightweight spellchecker written in Javascript.

### Installation

```shell script
yarn add tr-spellchecker
```

Optionaly you could add [dictionary](https://github.com/wooorm/dictionaries)

```shell script
yarn add dictionary-en
```

### API

Initialize a spellchecker instance:

```ts
import Spellchecker from 'rt-spellchecker'

const spellchecker = new Spellchecker('en')
const isValid = spellchecker.check('red')
```

Or load custom dictionary

```ts
const Spellchecker = require('rt-spellchecker')

const aff = require('dictionary-en/index.aff')
const dic = require('dictionary-en/index.dic')

const spellchecker = new Spellchecker()
spellchecker.dict.addAffixFile(aff)
spellchecker.dict.addDicFile(dic)

const isValid = spellchecker.check('red')
```

## License

Open source [licensed as MIT](https://en.wikipedia.org/wiki/MIT_License).
