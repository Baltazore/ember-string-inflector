import Inflector from "./inflector";
import { PluralizeOptions } from "./inflector";

function pluralize(word, wordOrCount, options?: PluralizeOptions) {
  return Inflector.inflector.pluralize(word, wordOrCount, options);
}

function singularize(word) {
  return Inflector.inflector.singularize(word);
}

export { pluralize, singularize };
