"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const en_1 = require("../src/shared/i18n/translations/en");
const de_1 = require("../src/shared/i18n/translations/de");
const enKeys = Object.keys(en_1.enTranslations);
const deKeys = Object.keys(de_1.deTranslations);
const missingInDe = enKeys.filter((key) => !(key in de_1.deTranslations));
const extraInDe = deKeys.filter((key) => !(key in en_1.enTranslations));
assert_1.default.strictEqual(missingInDe.length, 0, `Missing keys in de: ${missingInDe.join(', ')}`);
assert_1.default.strictEqual(extraInDe.length, 0, `Extra keys in de: ${extraInDe.join(', ')}`);
assert_1.default.ok(enKeys.length > 300, 'Expected a large translation dictionary');
assert_1.default.strictEqual(enKeys.length, deKeys.length);
console.log('tests/i18nTranslations.test.ts OK');
