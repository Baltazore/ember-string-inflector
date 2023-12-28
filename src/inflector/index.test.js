import Inflector from './index';
import { describe, beforeEach, afterEach, it, expect } from "bun:test";

let inflector;

describe('dsl', () => {
  beforeEach(() => {
    inflector = new Inflector(/* no rules == no rules */);
  })
  afterEach(() => {
    inflector = undefined;
  })

  it('ability to include counts', () => {
    inflector.plural(/$/, 's');
    expect(inflector.pluralize(1, 'cat')).toBe('1 cat', 'pluralize 1')
    expect(inflector.pluralize(5, 'cat')).toBe('5 cats', 'pluralize 5')
    expect(inflector.pluralize(5, 'cat', { withoutCount: true })).toBe('cats', 'without count')
  })

  it('ability to add additional pluralization rules', () => {
    expect(inflector.pluralize('cow')).toBe('cow', 'no pluralization rule');

    inflector.plural(/$/, 's');

    expect(inflector.pluralize('cow')).toBe('cows', 'pluralization rule was applied');
  });

  it('ability to add additional singularization rules', () => {
    expect(inflector.singularize('cows')).toBe('cows', 'no singularization rule was applied');

    inflector.singular(/s$/, '');

    expect(inflector.singularize('cows')).toBe('cow', 'singularization rule was applied');
  });

  it('ability to add additional uncountable rules', () => {
    inflector.plural(/$/, 's');
    expect(inflector.pluralize('cow')).toBe('cows', 'pluralization rule was applied');

    inflector.uncountable('cow');
    expect(inflector.pluralize('cow')).toBe('cow', 'pluralization rule NOT was applied');
    expect(inflector.pluralize('redCow')).toBe('redCow', 'pluralization rule NOT was applied');
    expect(inflector.pluralize('red-cow')).toBe('red-cow', 'pluralization rule NOT was applied');
    expect(inflector.pluralize('red/cow')).toBe('red/cow', 'pluralization rule NOT was applied');
  });

  it('ability to add additional irregular rules', () => {
    inflector.singular(/s$/, '');
    inflector.plural(/$/, 's');

    expect(inflector.singularize('cows')).toBe('cow', 'regular singularization rule was applied');
    expect(inflector.pluralize('cow')).toBe('cows', 'regular pluralization rule was applied');

    expect(inflector.singularize('red-cows')).toBe('red-cow', 'regular singularization rule was applied');
    expect(inflector.pluralize('red-cow')).toBe('red-cows', 'regular pluralization rule was applied');

    expect(inflector.singularize('redCows')).toBe('redCow', 'regular singularization rule was applied');
    expect(inflector.pluralize('redCow')).toBe('redCows', 'regular pluralization rule was applied');

    expect(inflector.singularize('red/cows')).toBe('red/cow', 'regular singularization rule was applied');
    expect(inflector.pluralize('red/cow')).toBe('red/cows', 'regular pluralization rule was applied');

    inflector.irregular('cow', 'kine');

    expect(inflector.singularize('kine')).toBe('cow', 'irregular singularization rule was applied');
    expect(inflector.pluralize('cow')).toBe('kine', 'irregular pluralization rule was applied');

    expect(inflector.singularize('red-kine')).toBe('red-cow', 'irregular singularization rule was applied');
    expect(inflector.pluralize('red-cow')).toBe('red-kine', 'irregular pluralization rule was applied');

    expect(inflector.singularize('red-red-cow')).toBe('red-red-cow', 'irregular singularization rule was applied correctly with dasherization');
    expect(inflector.singularize('red-red-kine')).toBe('red-red-cow', 'irregular singularization rule was applied correctly with dasherization');
    expect(inflector.pluralize('red-red-cow')).toBe('red-red-kine', 'irregular pluralization rule was applied correctly with dasherization');
    expect(inflector.pluralize('red-red-kine')).toBe('red-red-kine', 'irregular pluralization rule was applied correctly with dasherization');

    expect(inflector.singularize('redKine')).toBe('redCow', 'irregular singularization rule was applied');
    expect(inflector.pluralize('redCow')).toBe('redKine', 'irregular pluralization rule was applied');

    expect(inflector.singularize('red/kine')).toBe('red/cow', 'irregular singularization rule was applied');
    expect(inflector.pluralize('red/cow')).toBe('red/kine', 'irregular pluralization rule was applied');
  });

  it('ability to add identical singular and pluralizations', () => {

    inflector.singular(/s$/, '');
    inflector.plural(/$/, 's');

    expect(inflector.singularize('settings')).toBe('setting', 'regular singularization rule was applied');
    expect(inflector.pluralize('setting')).toBe('settings', 'regular pluralization rule was applied');

    inflector.irregular('settings', 'settings');
    inflector.irregular('userPreferences', 'userPreferences');

    expect(inflector.singularize('settings')).toBe('settings', 'irregular singularization rule was applied on lowercase word');
    expect(inflector.pluralize('settings')).toBe('settings', 'irregular pluralization rule was applied on lowercase word');

    expect(inflector.singularize('userPreferences')).toBe('userPreferences', 'irregular singularization rule was applied on camelcase word');
    expect(inflector.pluralize('userPreferences')).toBe('userPreferences', 'irregular pluralization rule was applied on camelcase word');
  });
});

describe('unit', () => {
  it('plurals', () => {
    inflector = new Inflector({
      plurals: [
        [/$/, 's'],
        [/s$/i, 's']
      ]
    });

    expect(inflector.pluralize('apple')).toBe('apples');
  });

  it('singularization', () => {
    inflector = new Inflector({
      singular: [
        [/s$/i, ''],
        [/(ss)$/i, '$1']
      ]
    });

    expect(inflector.singularize('apple')).toBe('apple');
  });

  it('singularization of irregular singulars', () => {
    inflector = new Inflector({
      singular: [
        [/s$/i, ''],
        [/(ss)$/i, '$1']
      ],
      irregularPairs: [
        ['lens', 'lenses']
      ]
    });

    expect(inflector.singularize('lens')).toBe('lens');
  });

  it('pluralization of irregular plurals', () => {
    inflector = new Inflector({
      plurals: [
        [/$/, 's']
      ],
      irregularPairs: [
        ['person', 'people']
      ]
    });

    expect(inflector.pluralize('people')).toBe('people');
  });

  it('plural', () => {
    inflector = new Inflector({
      plurals: [
        ['1', '1'],
        ['2', '2'],
        ['3', '3']
      ]
    });

    expect(inflector.rules.plurals.length).toBe(3)
  });

  it('singular', () => {
    inflector = new Inflector({
      singular: [
        ['1', '1'],
        ['2', '2'],
        ['3', '3']
      ]
    });

    expect(inflector.rules.singular.length).toBe(3)
  });

  it('irregular', () => {
    inflector = new Inflector({
      irregularPairs: [
        ['1', '12'],
        ['2', '22'],
        ['3', '32']
      ]
    });

    expect(inflector.rules.irregular.get('1')).toBe('12')
    expect(inflector.rules.irregular.get('2')).toBe('22')
    expect(inflector.rules.irregular.get('3')).toBe('32')

    expect(inflector.rules.irregularInverse.get('12')).toBe('1')
    expect(inflector.rules.irregularInverse.get('22')).toBe('2')
    expect(inflector.rules.irregularInverse.get('32')).toBe('3')
  });

  it('uncountable', () => {
    inflector = new Inflector({
      uncountable: [
        '1',
        '2',
        '3'
      ]
    });

    expect(inflector.rules.uncountable.get('1')).toBe(true)
    expect(inflector.rules.uncountable.get('2')).toBe(true)
    expect(inflector.rules.uncountable.get('3')).toBe(true)
  });

  it('inflect.nothing', () => {
    inflector = new Inflector();

    expect(inflector.inflect('', [])).toBe('');
    expect(inflector.inflect(' ', [])).toBe(' ');
  });

  it('inflect.noRules', () => {
    inflector = new Inflector();

    expect(inflector.inflect('word', [])).toBe('word');
  });

  it('inflect.uncountable', () => {
    inflector = new Inflector({
      plural: [
        [/$/, 's']
      ],
      uncountable: [
        'word'
      ]
    });

    let rules = [];

    expect(inflector.inflect('word', rules)).toBe('word');
  });

  it('inflect.irregular', () => {
    inflector = new Inflector({
      irregularPairs: [
        ['word', 'wordy']
      ]
    });

    let rules = [];

    expect(inflector.inflect('word', rules, inflector.rules.irregular)).toBe('wordy');
    expect(inflector.inflect('wordy', rules, inflector.rules.irregularInverse)).toBe('word');
  });

  it('inflect.basicRules', () => {
    inflector = new Inflector();
    let rules = [[/$/, 's']];

    expect(inflector.inflect('word', rules)).toBe('words');
  });

  it('inflect.advancedRules', () => {
    inflector = new Inflector();
    let rules = [[/^(ox)$/i, '$1en']];

    expect(inflector.inflect('ox', rules)).toBe('oxen');
  });

  it('Inflector.defaultRules', () => {
    let rules = Inflector.defaultRules;
    expect(rules).toBeTruthy('has defaultRules');
  });

  it('Inflector.inflector exists', () => {
    expect(Inflector.inflector).toBeTruthy('Inflector.inflector exists');
  });

  it('new Inflector with defaultRules matches docs', () => {
    inflector = new Inflector(Inflector.defaultRules);

    // defaultRules includes these special rules
    expect(inflector.pluralize('cow')).toBe('kine');
    expect(inflector.singularize('kine')).toBe('cow');

    // defaultRules adds 's' to singular
    expect(inflector.pluralize('item')).toBe('items');

    // defaultRules removes 's' from plural
    expect(inflector.singularize('items')).toBe('item');
  });

  it('words containing irregular and uncountable words can be pluralized', () => {
    inflector = new Inflector(Inflector.defaultRules);
    expect(inflector.pluralize('woman')).toBe('women');
    expect(inflector.pluralize('salesperson')).toBe('salespeople');
  });


  it('words containing irregular and uncountable words can be singularized', () => {
    inflector = new Inflector(Inflector.defaultRules);
    expect(inflector.singularize('women')).toBe('woman');
    expect(inflector.singularize('salespeople')).toBe('salesperson');
    expect(inflector.singularize('pufferfish')).toBe('pufferfish');
  });

  it('partial words containing uncountable words can be pluralized', () => {
    inflector = new Inflector(Inflector.defaultRules);
    expect(inflector.pluralize('price')).toBe('prices');
  });

  it('partial words containing uncountable words can be singularized', () => {
    inflector = new Inflector(Inflector.defaultRules);
    expect(inflector.singularize('subspecies')).toBe('subspecy');
  });

  it('CamelCase and UpperCamelCase is preserved for irregular and uncountable pluralizations', () => {
    inflector = new Inflector(Inflector.defaultRules);
    expect(inflector.pluralize('SuperWoman')).toBe('SuperWomen');
    expect(inflector.pluralize('superWoman')).toBe('superWomen');
    expect(inflector.pluralize('SuperMan')).toBe('SuperMen');
    expect(inflector.pluralize('superMan')).toBe('superMen');
    expect(inflector.pluralize('FriedRice')).toBe('FriedRice');
    expect(inflector.pluralize('friedRice')).toBe('friedRice');
  });


  it('CamelCase and UpperCamelCase is preserved for irregular and uncountable singularization', () => {
    inflector = new Inflector(Inflector.defaultRules);
    expect(inflector.singularize('SuperWomen')).toBe('SuperWoman');
    expect(inflector.singularize('superWomen')).toBe('superWoman');
    expect(inflector.singularize('SuperMen')).toBe('SuperMan');
    expect(inflector.singularize('superMen')).toBe('superMan');
    expect(inflector.singularize('FriedRice')).toBe('FriedRice');
    expect(inflector.singularize('friedRice')).toBe('friedRice');
  });

  it('CamelCase custom irregular words', () => {
    inflector = new Inflector(Inflector.defaultRules);
    inflector.irregular('unitOfMeasure', 'unitsOfMeasure');
    inflector.irregular('tipoDocumento', 'tiposDocumento');

    expect(inflector.singularize('unitsOfMeasure')).toBe('unitOfMeasure');
    expect(inflector.pluralize('unitOfMeasure')).toBe('unitsOfMeasure');

    expect(inflector.singularize('tiposDocumento')).toBe('tipoDocumento');
    expect(inflector.pluralize('tipoDocumento')).toBe('tiposDocumento');
  });

  it('Inflector.pluralize passes same test cases as ActiveSupport::Inflector#pluralize', () => {
    inflector = new Inflector(Inflector.defaultRules);

    expect(inflector.pluralize('search')).toBe('searches');
    expect(inflector.pluralize('switch')).toBe('switches');
    expect(inflector.pluralize('fix')).toBe('fixes');
    expect(inflector.pluralize('box')).toBe('boxes');
    expect(inflector.pluralize('process')).toBe('processes');
    expect(inflector.pluralize('address')).toBe('addresses');
    expect(inflector.pluralize('case')).toBe('cases');
    expect(inflector.pluralize('stack')).toBe('stacks');
    expect(inflector.pluralize('wish')).toBe('wishes');
    expect(inflector.pluralize('fish')).toBe('fish');
    expect(inflector.pluralize('jeans')).toBe('jeans');
    expect(inflector.pluralize('funky jeans')).toBe('funky jeans');
    expect(inflector.pluralize('my money')).toBe('my money');
    expect(inflector.pluralize('category')).toBe('categories');
    expect(inflector.pluralize('query')).toBe('queries');
    expect(inflector.pluralize('ability')).toBe('abilities');
    expect(inflector.pluralize('agency')).toBe('agencies');
    expect(inflector.pluralize('movie')).toBe('movies');
    expect(inflector.pluralize('archive')).toBe('archives');
    expect(inflector.pluralize('index')).toBe('indices');
    expect(inflector.pluralize('wife')).toBe('wives');
    expect(inflector.pluralize('safe')).toBe('saves');
    expect(inflector.pluralize('half')).toBe('halves');
    expect(inflector.pluralize('move')).toBe('moves');
    expect(inflector.pluralize('salesperson')).toBe('salespeople');
    expect(inflector.pluralize('person')).toBe('people');
    expect(inflector.pluralize('spokesman')).toBe('spokesmen');
    expect(inflector.pluralize('man')).toBe('men');
    expect(inflector.pluralize('woman')).toBe('women');
    expect(inflector.pluralize('basis')).toBe('bases');
    expect(inflector.pluralize('diagnosis')).toBe('diagnoses');
    expect(inflector.pluralize('diagnosis_a')).toBe('diagnosis_as');
    expect(inflector.pluralize('datum')).toBe('data');
    expect(inflector.pluralize('medium')).toBe('media');
    expect(inflector.pluralize('stadium')).toBe('stadia');
    expect(inflector.pluralize('analysis')).toBe('analyses');
    expect(inflector.pluralize('my_analysis')).toBe('my_analyses');
    expect(inflector.pluralize('node_child')).toBe('node_children');
    expect(inflector.pluralize('child')).toBe('children');
    expect(inflector.pluralize('experience')).toBe('experiences');
    expect(inflector.pluralize('day')).toBe('days');
    expect(inflector.pluralize('comment')).toBe('comments');
    expect(inflector.pluralize('foobar')).toBe('foobars');
    expect(inflector.pluralize('newsletter')).toBe('newsletters');
    expect(inflector.pluralize('old_news')).toBe('old_news');
    expect(inflector.pluralize('news')).toBe('news');
    expect(inflector.pluralize('series')).toBe('series');
    expect(inflector.pluralize('miniseries')).toBe('miniseries');
    expect(inflector.pluralize('species')).toBe('species');
    expect(inflector.pluralize('quiz')).toBe('quizzes');
    expect(inflector.pluralize('perspective')).toBe('perspectives');
    expect(inflector.pluralize('ox')).toBe('oxen');
    expect(inflector.pluralize('photo')).toBe('photos');
    expect(inflector.pluralize('buffalo')).toBe('buffaloes');
    expect(inflector.pluralize('tomato')).toBe('tomatoes');
    expect(inflector.pluralize('dwarf')).toBe('dwarves');
    expect(inflector.pluralize('elf')).toBe('elves');
    expect(inflector.pluralize('information')).toBe('information');
    expect(inflector.pluralize('equipment')).toBe('equipment');
    expect(inflector.pluralize('bus')).toBe('buses');
    expect(inflector.pluralize('status')).toBe('statuses');
    expect(inflector.pluralize('status_code')).toBe('status_codes');
    expect(inflector.pluralize('mouse')).toBe('mice');
    expect(inflector.pluralize('louse')).toBe('lice');
    expect(inflector.pluralize('house')).toBe('houses');
    expect(inflector.pluralize('octopus')).toBe('octopi');
    expect(inflector.pluralize('virus')).toBe('viri');
    expect(inflector.pluralize('alias')).toBe('aliases');
    expect(inflector.pluralize('portfolio')).toBe('portfolios');
    expect(inflector.pluralize('vertex')).toBe('vertices');
    expect(inflector.pluralize('matrix')).toBe('matrices');
    expect(inflector.pluralize('matrix_fu')).toBe('matrix_fus');
    expect(inflector.pluralize('axis')).toBe('axes');
    expect(inflector.pluralize('taxi')).toBe('taxis');
    expect(inflector.pluralize('testis')).toBe('testes');
    expect(inflector.pluralize('crisis')).toBe('crises');
    expect(inflector.pluralize('rice')).toBe('rice');
    expect(inflector.pluralize('shoe')).toBe('shoes');
    expect(inflector.pluralize('horse')).toBe('horses');
    expect(inflector.pluralize('prize')).toBe('prizes');
    expect(inflector.pluralize('edge')).toBe('edges');
    expect(inflector.pluralize('database')).toBe('databases');
    expect(inflector.pluralize('|ice')).toBe('|ices');
    expect(inflector.pluralize('|ouse')).toBe('|ouses');
    expect(inflector.pluralize('slice')).toBe('slices');
    expect(inflector.pluralize('police')).toBe('police');
  });

  it('Inflector.singularize passes same test cases as ActiveSupport::Inflector#singularize', () => {
    inflector = new Inflector(Inflector.defaultRules);

    expect(inflector.singularize('searches')).toBe('search');
    expect(inflector.singularize('switches')).toBe('switch');
    expect(inflector.singularize('fixes')).toBe('fix');
    expect(inflector.singularize('boxes')).toBe('box');
    expect(inflector.singularize('processes')).toBe('process');
    expect(inflector.singularize('addresses')).toBe('address');
    expect(inflector.singularize('cases')).toBe('case');
    expect(inflector.singularize('stacks')).toBe('stack');
    expect(inflector.singularize('wishes')).toBe('wish');
    expect(inflector.singularize('fish')).toBe('fish');
    expect(inflector.singularize('jeans')).toBe('jeans');
    expect(inflector.singularize('funky jeans')).toBe('funky jeans');
    expect(inflector.singularize('my money')).toBe('my money');
    expect(inflector.singularize('categories')).toBe('category');
    expect(inflector.singularize('queries')).toBe('query');
    expect(inflector.singularize('abilities')).toBe('ability');
    expect(inflector.singularize('agencies')).toBe('agency');
    expect(inflector.singularize('movies')).toBe('movie');
    expect(inflector.singularize('archives')).toBe('archive');
    expect(inflector.singularize('indices')).toBe('index');
    expect(inflector.singularize('wives')).toBe('wife');
    expect(inflector.singularize('saves')).toBe('safe');
    expect(inflector.singularize('halves')).toBe('half');
    expect(inflector.singularize('moves')).toBe('move');
    expect(inflector.singularize('salespeople')).toBe('salesperson');
    expect(inflector.singularize('people')).toBe('person');
    expect(inflector.singularize('spokesmen')).toBe('spokesman');
    expect(inflector.singularize('men')).toBe('man');
    expect(inflector.singularize('women')).toBe('woman');
    expect(inflector.singularize('bases')).toBe('basis');
    expect(inflector.singularize('diagnoses')).toBe('diagnosis');
    expect(inflector.singularize('diagnosis_as')).toBe('diagnosis_a');
    expect(inflector.singularize('data')).toBe('datum');
    expect(inflector.singularize('media')).toBe('medium');
    expect(inflector.singularize('stadia')).toBe('stadium');
    expect(inflector.singularize('analyses')).toBe('analysis');
    expect(inflector.singularize('my_analyses')).toBe('my_analysis');
    expect(inflector.singularize('node_children')).toBe('node_child');
    expect(inflector.singularize('children')).toBe('child');
    expect(inflector.singularize('experiences')).toBe('experience');
    expect(inflector.singularize('days')).toBe('day');
    expect(inflector.singularize('comments')).toBe('comment');
    expect(inflector.singularize('foobars')).toBe('foobar');
    expect(inflector.singularize('newsletters')).toBe('newsletter');
    expect(inflector.singularize('old_news')).toBe('old_news');
    expect(inflector.singularize('news')).toBe('news');
    expect(inflector.singularize('series')).toBe('series');
    expect(inflector.singularize('miniseries')).toBe('miniseries');
    expect(inflector.singularize('species')).toBe('species');
    expect(inflector.singularize('quizzes')).toBe('quiz');
    expect(inflector.singularize('perspectives')).toBe('perspective');
    expect(inflector.singularize('oxen')).toBe('ox');
    expect(inflector.singularize('photos')).toBe('photo');
    expect(inflector.singularize('buffaloes')).toBe('buffalo');
    expect(inflector.singularize('tomatoes')).toBe('tomato');
    expect(inflector.singularize('dwarves')).toBe('dwarf');
    expect(inflector.singularize('elves')).toBe('elf');
    expect(inflector.singularize('information')).toBe('information');
    expect(inflector.singularize('equipment')).toBe('equipment');
    expect(inflector.singularize('buses')).toBe('bus');
    expect(inflector.singularize('statuses')).toBe('status');
    expect(inflector.singularize('status_codes')).toBe('status_code');
    expect(inflector.singularize('mice')).toBe('mouse');
    expect(inflector.singularize('lice')).toBe('louse');
    expect(inflector.singularize('houses')).toBe('house');
    expect(inflector.singularize('octopi')).toBe('octopus');
    expect(inflector.singularize('viri')).toBe('virus');
    expect(inflector.singularize('aliases')).toBe('alias');
    expect(inflector.singularize('portfolios')).toBe('portfolio');
    expect(inflector.singularize('vertices')).toBe('vertex');
    expect(inflector.singularize('matrices')).toBe('matrix');
    expect(inflector.singularize('matrix_fus')).toBe('matrix_fu');
    expect(inflector.singularize('axes')).toBe('axis');
    expect(inflector.singularize('taxis')).toBe('taxi');
    expect(inflector.singularize('testes')).toBe('testis');
    expect(inflector.singularize('crises')).toBe('crisis');
    expect(inflector.singularize('rice')).toBe('rice');
    expect(inflector.singularize('shoes')).toBe('shoe');
    expect(inflector.singularize('horses')).toBe('horse');
    expect(inflector.singularize('prizes')).toBe('prize');
    expect(inflector.singularize('edges')).toBe('edge');
    expect(inflector.singularize('databases')).toBe('database');
    expect(inflector.singularize('|ices')).toBe('|ice');
    expect(inflector.singularize('|ouses')).toBe('|ouse');
    expect(inflector.singularize('slices')).toBe('slice');
    expect(inflector.singularize('police')).toBe('police');
  });

  it('Inflector.singularize can singularize "bonuses"', () => {
    inflector = new Inflector(Inflector.defaultRules);

    expect(inflector.singularize('bonuses')).toBe('bonus');
  });

  it('Inflector.singularize can pluralize "bonus"', () => {
    inflector = new Inflector(Inflector.defaultRules);

    expect(inflector.pluralize('bonus')).toBe('bonuses');
  });

});