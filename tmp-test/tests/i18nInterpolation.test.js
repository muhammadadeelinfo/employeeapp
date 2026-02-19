"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const languageUtils_1 = require("../src/shared/utils/languageUtils");
const en_1 = require("../src/shared/i18n/translations/en");
const de_1 = require("../src/shared/i18n/translations/de");
const translations = {
    en: en_1.enTranslations,
    de: de_1.deTranslations,
};
const translate = (language, key, vars) => (0, languageUtils_1.interpolate)(translations[language][key], vars);
assert_1.default.strictEqual(translate('en', 'notificationsPanelTitle'), 'Notifications');
assert_1.default.strictEqual(translate('de', 'notificationsPanelTitle'), 'Benachrichtigungen');
assert_1.default.strictEqual(translate('en', 'securityResetLinkSent', { email: 'a@b.com' }), 'Password reset link sent to a@b.com.');
assert_1.default.strictEqual(translate('de', 'securityResetLinkSent', { email: 'a@b.com' }), 'Link zum Zurücksetzen des Passworts wurde an a@b.com gesendet.');
assert_1.default.strictEqual(translate('en', 'notificationsPanelWaiting', { count: 4 }), '4 waiting');
assert_1.default.strictEqual(translate('de', 'notificationsPanelWaiting', { count: 4 }), '4 offen');
console.log('tests/i18nInterpolation.test.ts OK');
