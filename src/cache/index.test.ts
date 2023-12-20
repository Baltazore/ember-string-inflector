import { describe, it, expect } from "bun:test";
import { camelize, capitalize, dasherize, decamelize, underscore } from ".";

const createTestFunction = (fn) => {
  return (given, expected, description) => {
    return it(description, () => {
      expect(fn(given)).toBe(expected);
    });
  };
};

describe("camelize tests", () => {
  const test = createTestFunction(camelize);

  test("my favorite items", "myFavoriteItems", "camelize normal string");
  test("I Love Ramen", "iLoveRamen", "camelize capitalized string");
  test("css-class-name", "cssClassName", "camelize dasherized string");
  test("action_name", "actionName", "camelize underscored string");
  test("action.name", "actionName", "camelize dot notation string");
  test("innerHTML", "innerHTML", "does nothing with camelcased string");
  test(
    "PrivateDocs/OwnerInvoice",
    "privateDocs/ownerInvoice",
    "camelize namespaced classified string"
  );
  test(
    "private_docs/owner_invoice",
    "privateDocs/ownerInvoice",
    "camelize namespaced underscored string"
  );
  test(
    "private-docs/owner-invoice",
    "privateDocs/ownerInvoice",
    "camelize namespaced dasherized string"
  );
});

describe("capitalize tests", () => {
  const test = createTestFunction(capitalize);

  test("my favorite items", "My favorite items", "capitalize normal string");
  test("css-class-name", "Css-class-name", "capitalize dasherized string");
  test("action_name", "Action_name", "capitalize underscored string");
  test("innerHTML", "InnerHTML", "capitalize camelcased string");
  test(
    "Capitalized string",
    "Capitalized string",
    "does nothing with capitalized string"
  );
  test(
    "privateDocs/ownerInvoice",
    "PrivateDocs/OwnerInvoice",
    "capitalize namespaced camelized string"
  );
  test(
    "private_docs/owner_invoice",
    "Private_docs/Owner_invoice",
    "capitalize namespaced underscored string"
  );
  test(
    "private-docs/owner-invoice",
    "Private-docs/Owner-invoice",
    "capitalize namespaced dasherized string"
  );
  test("šabc", "Šabc", "capitalize string with accent character");
});

describe("dasherize tests", () => {
  const test = createTestFunction(dasherize);

  test("my favorite items", "my-favorite-items", "dasherize normal string");
  test(
    "css-class-name",
    "css-class-name",
    "does nothing with dasherized string"
  );
  test("action_name", "action-name", "dasherize underscored string");
  test("innerHTML", "inner-html", "dasherize camelcased string");
  test(
    "toString",
    "to-string",
    "dasherize string that is the property name of Object.prototype"
  );
  test(
    "PrivateDocs/OwnerInvoice",
    "private-docs/owner-invoice",
    "dasherize namespaced classified string"
  );
  test(
    "privateDocs/ownerInvoice",
    "private-docs/owner-invoice",
    "dasherize namespaced camelized string"
  );
  test(
    "private_docs/owner_invoice",
    "private-docs/owner-invoice",
    "dasherize namespaced underscored string"
  );
});

describe("decamelize tests", () => {
  const test = createTestFunction(decamelize);

  test(
    "my favorite items",
    "my favorite items",
    "does nothing with normal string"
  );
  test(
    "css-class-name",
    "css-class-name",
    "does nothing with dasherized string"
  );
  test("action_name", "action_name", "does nothing with underscored string");
  test(
    "innerHTML",
    "inner_html",
    "converts a camelized string into all lower case separated by underscores."
  );
  test("size160Url", "size160_url", "decamelizes strings with numbers");
  test(
    "PrivateDocs/OwnerInvoice",
    "private_docs/owner_invoice",
    "decamelize namespaced classified string"
  );
  test(
    "privateDocs/ownerInvoice",
    "private_docs/owner_invoice",
    "decamelize namespaced camelized string"
  );
});

describe("underscore tests", () => {
  const test = createTestFunction(underscore);

  test("my favorite items", "my_favorite_items", "with normal string");
  test("css-class-name", "css_class_name", "with dasherized string");
  test("action_name", "action_name", "does nothing with underscored string");
  test("innerHTML", "inner_html", "with camelcased string");
  test(
    "PrivateDocs/OwnerInvoice",
    "private_docs/owner_invoice",
    "underscore namespaced classified string"
  );
  test(
    "privateDocs/ownerInvoice",
    "private_docs/owner_invoice",
    "underscore namespaced camelized string"
  );
  test(
    "private-docs/owner-invoice",
    "private_docs/owner_invoice",
    "underscore namespaced dasherized string"
  );
});
