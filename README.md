# Real Time Spellchecker in Javascript

[![NPM version](https://badge.fury.io/js/rt-spellcheck.svg)](http://badge.fury.io/js/rt-spellcheck)

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
