/* eslint-disable no-useless-escape */
/**
 @module @ember/string
 */
import Cache from "./cache";

const STRING_DASHERIZE_REGEXP = /[ _]/g;

const STRING_DASHERIZE_CACHE = new Cache<string, string>(1000, (key) =>
  decamelize(key).replace(STRING_DASHERIZE_REGEXP, "-")
);

const STRING_CAMELIZE_REGEXP_1 = /(\-|\_|\.|\s)+(.)?/g;
const STRING_CAMELIZE_REGEXP_2 = /(^|\/)([A-Z])/g;

const CAMELIZE_CACHE = new Cache<string, string>(1000, (key) =>
  key
    .replace(STRING_CAMELIZE_REGEXP_1, (_match, _separator, chr) =>
      chr ? chr.toUpperCase() : ""
    )
    .replace(STRING_CAMELIZE_REGEXP_2, (match /*, separator, chr */) =>
      match.toLowerCase()
    )
);

const STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g;
const STRING_UNDERSCORE_REGEXP_2 = /\-|\s+/g;

const UNDERSCORE_CACHE = new Cache<string, string>(1000, (str) =>
  str
    .replace(STRING_UNDERSCORE_REGEXP_1, "$1_$2")
    .replace(STRING_UNDERSCORE_REGEXP_2, "_")
    .toLowerCase()
);

const STRING_CAPITALIZE_REGEXP = /(^|\/)([a-z\u00C0-\u024F])/g;

const CAPITALIZE_CACHE = new Cache<string, string>(1000, (str) =>
  str.replace(STRING_CAPITALIZE_REGEXP, (match /*, separator, chr */) =>
    match.toUpperCase()
  )
);

const STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;

const DECAMELIZE_CACHE = new Cache<string, string>(1000, (str) =>
  str.replace(STRING_DECAMELIZE_REGEXP, "$1_$2").toLowerCase()
);

/**
   Converts a camelized string into all lower case separated by underscores.
 
   ```javascript
   import { decamelize } from '@ember/string';
 
   decamelize('innerHTML');          // 'inner_html'
   decamelize('action_name');        // 'action_name'
   decamelize('css-class-name');     // 'css-class-name'
   decamelize('my favorite items');  // 'my favorite items'
   ```
 
   @method decamelize
   @param {String} str The string to decamelize.
   @return {String} the decamelized string.
   @public
 */
export function decamelize(str: string): string {
  return DECAMELIZE_CACHE.get(str);
}

/**
   Replaces underscores, spaces, or camelCase with dashes.
 
   ```javascript
   import { dasherize } from '@ember/string';
 
   dasherize('innerHTML');                // 'inner-html'
   dasherize('action_name');              // 'action-name'
   dasherize('css-class-name');           // 'css-class-name'
   dasherize('my favorite items');        // 'my-favorite-items'
   dasherize('privateDocs/ownerInvoice';  // 'private-docs/owner-invoice'
   ```
 
   @method dasherize
   @param {String} str The string to dasherize.
   @return {String} the dasherized string.
   @public
 */
export function dasherize(str: string): string {
  return STRING_DASHERIZE_CACHE.get(str);
}

/**
   Returns the lowerCamelCase form of a string.
 
   ```javascript
   import { camelize } from '@ember/string';
 
   camelize('innerHTML');                   // 'innerHTML'
   camelize('action_name');                 // 'actionName'
   camelize('css-class-name');              // 'cssClassName'
   camelize('my favorite items');           // 'myFavoriteItems'
   camelize('My Favorite Items');           // 'myFavoriteItems'
   camelize('private-docs/owner-invoice');  // 'privateDocs/ownerInvoice'
   ```
 
   @method camelize
   @param {String} str The string to camelize.
   @return {String} the camelized string.
   @public
 */
export function camelize(str: string): string {
  return CAMELIZE_CACHE.get(str);
}

/**
   More general than decamelize. Returns the lower\_case\_and\_underscored
   form of a string.
 
   ```javascript
   import { underscore } from '@ember/string';
 
   underscore('innerHTML');                 // 'inner_html'
   underscore('action_name');               // 'action_name'
   underscore('css-class-name');            // 'css_class_name'
   underscore('my favorite items');         // 'my_favorite_items'
   underscore('privateDocs/ownerInvoice');  // 'private_docs/owner_invoice'
   ```
 
   @method underscore
   @param {String} str The string to underscore.
   @return {String} the underscored string.
   @public
 */
export function underscore(str: string): string {
  return UNDERSCORE_CACHE.get(str);
}

/**
   Returns the Capitalized form of a string
 
   ```javascript
   import { capitalize } from '@ember/string';
 
   capitalize('innerHTML')                 // 'InnerHTML'
   capitalize('action_name')               // 'Action_name'
   capitalize('css-class-name')            // 'Css-class-name'
   capitalize('my favorite items')         // 'My favorite items'
   capitalize('privateDocs/ownerInvoice'); // 'PrivateDocs/ownerInvoice'
   ```
 
   @method capitalize
   @param {String} str The string to capitalize.
   @return {String} The capitalized string.
   @public
 */
export function capitalize(str: string): string {
  return CAPITALIZE_CACHE.get(str);
}
