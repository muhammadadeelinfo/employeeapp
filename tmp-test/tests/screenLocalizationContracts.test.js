"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const en_1 = require("../src/shared/i18n/translations/en");
const de_1 = require("../src/shared/i18n/translations/de");
const files = ['app/notifications.tsx', 'app/(tabs)/account.tsx'];
const keyPattern = /t\('([A-Za-z0-9_]+)'/g;
const keys = new Set();
for (const file of files) {
    const source = fs_1.default.readFileSync(file, 'utf8');
    let match = null;
    while ((match = keyPattern.exec(source)) !== null) {
        keys.add(match[1]);
    }
}
assert_1.default.ok(keys.size > 0, 'Expected to find localization keys in target screens');
for (const key of keys) {
    assert_1.default.ok(key in en_1.enTranslations, `Missing key in EN translations: ${key}`);
    assert_1.default.ok(key in de_1.deTranslations, `Missing key in DE translations: ${key}`);
}
console.log('tests/screenLocalizationContracts.test.ts OK');
