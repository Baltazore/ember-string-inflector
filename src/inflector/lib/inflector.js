import { capitalize } from '../../cache/index';
import defaultRules from "./inflections";

const BLANK_REGEX = /^\s*$/;
const LAST_WORD_DASHED_REGEX = /([\w/-]+[_/\s-])([a-z\d]+$)/;
const LAST_WORD_CAMELIZED_REGEX = /([\w/\s-]+)([A-Z][a-z\d]*$)/;
const CAMELIZED_REGEX = /[A-Z][a-z\d]*$/;

/**
  Inflector provides a mechanism for supplying inflection rules for your
  application. It includes a default set of inflection rules, and provides an
  API for providing additional rules.

  Examples:

  Creating an inflector with no rules.

  ```js
  const inflector = new Inflector();
  ```

  Creating an inflector with the default ember ruleset.

  ```js
  const inflector = new Inflector(Inflector.defaultRules);

  inflector.pluralize('cow'); //=> 'kine'
  inflector.singularize('kine'); //=> 'cow'
  ```

  Creating an inflector and adding rules later.

  ```javascript
  const inflector = Inflector.inflector;

  inflector.pluralize('advice'); // => 'advices'
  inflector.uncountable('advice');
  inflector.pluralize('advice'); // => 'advice'

  inflector.pluralize('formula'); // => 'formulas'
  inflector.irregular('formula', 'formulae');
  inflector.pluralize('formula'); // => 'formulae'

  // you would not need to add these as they are the default rules
  inflector.plural(/$/, 's');
  inflector.singular(/s$/i, '');
  ```

  Creating an inflector with a non-default ruleset.

  ```javascript
  let rules = {
    plurals:  [
      [ /$/, 's' ]
    ],
    singular: [
      [ /\s$/, '' ]
    ],
    irregularPairs: [
      [ 'cow', 'kine' ]
    ],
    uncountable: [ 'fish' ]
  };

  const inflector = new Inflector(rules);
  ```

  @class Inflector
*/
class Inflector {
  _sCache = new Map();
  _pCache = new Map();

  constructor(ruleSet) {
    ruleSet = ruleSet || {};
    ruleSet.uncountable = ruleSet.uncountable || new Map();
    ruleSet.irregularPairs = ruleSet.irregularPairs || new Map();

    this.rules = {
      plurals: ruleSet.plurals || [],
      singular: ruleSet.singular || [],
      irregular: new Map(),
      irregularInverse: new Map(),
      uncountable: new Map()
    };

    this.loadUncountable(ruleSet.uncountable);
    this.loadIrregular(ruleSet.irregularPairs);
  }

  singularize(word) {
    return this._sCache.get(word) || this._sCache.set(word, this._singularize(word));
  };

  pluralize(numberOrWord, word, options = {}) {
    let cacheKey = [numberOrWord, word, options.withoutCount]
    return this._pCache.get(cacheKey) || this._pCache.set(cacheKey, this._pluralize(numberOrWord, word, options));
  };

  loadUncountable(uncountable) {
    uncountable.forEach((word) => {
      this.rules.uncountable.set(word.toLowerCase(), true);
    });
  }

  loadIrregular(irregularPairs) {
    irregularPairs.forEach((pair) => {
      //pluralizing
      this.rules.irregular.set(pair[0].toLowerCase(), pair[1]);
      this.rules.irregular.set(pair[1].toLowerCase(), pair[1]);

      //singularizing
      this.rules.irregularInverse.set(pair[1].toLowerCase(), pair[0]);
      this.rules.irregularInverse.set(pair[0].toLowerCase(), pair[0]);
    });
  }


  /**
    @method plural
    @param {RegExp} regex
    @param {String} string
  */
  plural(regex, string) {
    if (this._cacheUsed) { this.purgeCache(); }
    this.rules.plurals.push([regex, string.toLowerCase()]);
  }

  /**
    @method singular
    @param {RegExp} regex
    @param {String} string
  */
  singular(regex, string) {
    this.rules.singular.push([regex, string.toLowerCase()]);
  }

  /**
    @method uncountable
    @param {String} regex
  */
  uncountable(string) {
    this.loadUncountable([string.toLowerCase()]);
  }

  /**
    @method irregular
    @param {String} singular
    @param {String} plural
  */
  irregular(singular, plural) {
    this.loadIrregular([[singular, plural]]);
  }

  /**
    @method pluralize
    @param {String} word
  */
  pluralize() {
    return this._pluralize(...arguments);
  }

  _pluralize(wordOrCount, word, options = {}) {
    if (word === undefined) {
      return this.inflect(wordOrCount, this.rules.plurals, this.rules.irregular);
    }

    if (parseFloat(wordOrCount) !== 1) {
      word = this.inflect(word, this.rules.plurals, this.rules.irregular);
    }

    return options.withoutCount ? word : `${wordOrCount} ${word}`;
  }

  /**
    @method singularize
    @param {String} word
  */
  singularize(word) {
    return this._singularize(word);
  }

  _singularize(word) {
    return this.inflect(word, this.rules.singular, this.rules.irregularInverse);
  }

  /**
    @protected

    @method inflect
    @param {String} word
    @param {Object} typeRules
    @param {Map} irregular
  */
  inflect(word, typeRules, irregular = new Map()) {
    let inflection, substitution, result, lowercase, wordSplit,
      lastWord, isBlank, isCamelized, rule, isUncountable;

    isBlank = !word || BLANK_REGEX.test(word);
    isCamelized = CAMELIZED_REGEX.test(word);

    if (isBlank) {
      return word;
    }

    lowercase = word.toLowerCase();
    wordSplit = LAST_WORD_DASHED_REGEX.exec(word) || LAST_WORD_CAMELIZED_REGEX.exec(word);

    if (wordSplit) {
      lastWord = wordSplit[2].toLowerCase();
    }

    isUncountable = this.rules.uncountable.has(lowercase) || this.rules.uncountable.has(lastWord);

    if (isUncountable) {
      return word;
    }

    for ([rule, substitution] of irregular) {
      if (lowercase.match(rule + "$")) {
        if (isCamelized && irregular.has(lastWord)) {
          substitution = capitalize(substitution);
          rule = capitalize(rule);
        }

        return word.replace(new RegExp(rule, 'i'), substitution);
      }
    }

    for (let i = typeRules.length, min = 0; i > min; i--) {
      inflection = typeRules[i - 1];
      rule = inflection[0];

      if (rule.test(word)) {
        break;
      }
    }

    inflection = inflection || [];

    rule = inflection[0];
    substitution = inflection[1];

    result = word.replace(rule, substitution);

    return result;
  }
}

Inflector.defaultRules = defaultRules;
Inflector.inflector = new Inflector(defaultRules);

export default Inflector;
