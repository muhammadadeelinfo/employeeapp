"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const notificationUtils_1 = require("../src/shared/utils/notificationUtils");
const en_1 = require("../src/shared/i18n/translations/en");
const de_1 = require("../src/shared/i18n/translations/de");
const categories = [
    'shift-published',
    'shift-removed',
    'shift-schedule',
    'admin',
    'general',
];
categories.forEach((category) => {
    const labelKey = notificationUtils_1.notificationCategoryLabelKeys[category];
    assert_1.default.ok(labelKey, `Missing label key for category: ${category}`);
    assert_1.default.ok(labelKey in en_1.enTranslations, `Label key missing in EN dictionary: ${labelKey}`);
    assert_1.default.ok(labelKey in de_1.deTranslations, `Label key missing in DE dictionary: ${labelKey}`);
    assert_1.default.strictEqual(typeof en_1.enTranslations[labelKey], 'string');
    assert_1.default.strictEqual(typeof de_1.deTranslations[labelKey], 'string');
});
console.log('tests/notificationLocalization.test.ts OK');
