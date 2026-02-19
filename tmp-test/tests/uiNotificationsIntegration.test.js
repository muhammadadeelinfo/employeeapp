"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const notificationsViewModel_1 = require("../src/shared/utils/notificationsViewModel");
const languageUtils_1 = require("../src/shared/utils/languageUtils");
const en_1 = require("../src/shared/i18n/translations/en");
const de_1 = require("../src/shared/i18n/translations/de");
const renderSummary = (language, unreadCount) => {
    const dict = language === 'en' ? en_1.enTranslations : de_1.deTranslations;
    const key = (0, notificationsViewModel_1.getNotificationsSummaryTranslationKey)(unreadCount);
    return (0, languageUtils_1.interpolate)(dict[key], { count: unreadCount });
};
assert_1.default.strictEqual(renderSummary('en', 3), '3 waiting');
assert_1.default.strictEqual(renderSummary('de', 3), '3 offen');
assert_1.default.strictEqual(renderSummary('en', 0), 'All caught up');
assert_1.default.strictEqual(renderSummary('de', 0), 'Alles erledigt');
console.log('tests/uiNotificationsIntegration.test.ts OK');
