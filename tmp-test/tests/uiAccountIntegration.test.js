"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const responsiveLayout_1 = require("../src/shared/utils/responsiveLayout");
const de_1 = require("../src/shared/i18n/translations/de");
const en_1 = require("../src/shared/i18n/translations/en");
assert_1.default.strictEqual((0, responsiveLayout_1.shouldStackForCompactWidth)(393), true);
assert_1.default.strictEqual((0, responsiveLayout_1.shouldStackForCompactWidth)(430), false);
assert_1.default.ok(de_1.deTranslations.profileGreeting.includes('{name}'));
assert_1.default.ok(en_1.enTranslations.profileGreeting.includes('{name}'));
assert_1.default.notStrictEqual(de_1.deTranslations.notificationsSectionTitle, en_1.enTranslations.notificationsSectionTitle);
console.log('tests/uiAccountIntegration.test.ts OK');
