"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const i18nUtils_1 = require("../src/shared/utils/i18nUtils");
const dictionary = {
    existing: 'Localized value',
    empty: '',
};
assert_1.default.strictEqual((0, i18nUtils_1.getTranslationValue)(dictionary, 'existing'), 'Localized value');
const events = [];
(0, i18nUtils_1.setMissingTranslationHandler)((payload) => {
    events.push(payload);
});
assert_1.default.strictEqual((0, i18nUtils_1.getTranslationValue)(dictionary, 'missing_key'), 'missing_key');
assert_1.default.strictEqual((0, i18nUtils_1.getTranslationValue)(dictionary, 'empty'), 'empty');
assert_1.default.strictEqual(events.length, 2);
assert_1.default.deepStrictEqual(events[0], { key: 'missing_key', reason: 'missing' });
assert_1.default.deepStrictEqual(events[1], { key: 'empty', reason: 'empty' });
(0, i18nUtils_1.setMissingTranslationHandler)(null);
console.log('tests/i18nSafeguard.test.ts OK');
