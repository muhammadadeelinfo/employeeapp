import assert from 'assert';
import { enTranslations } from '../src/shared/i18n/translations/en';
import { deTranslations } from '../src/shared/i18n/translations/de';

const enKeys = Object.keys(enTranslations);
const deKeys = Object.keys(deTranslations);

const missingInDe = enKeys.filter((key) => !(key in deTranslations));
const extraInDe = deKeys.filter((key) => !(key in enTranslations));

assert.strictEqual(missingInDe.length, 0, `Missing keys in de: ${missingInDe.join(', ')}`);
assert.strictEqual(extraInDe.length, 0, `Extra keys in de: ${extraInDe.join(', ')}`);

assert.ok(enKeys.length > 300, 'Expected a large translation dictionary');
assert.strictEqual(enKeys.length, deKeys.length);

console.log('tests/i18nTranslations.test.ts OK');
