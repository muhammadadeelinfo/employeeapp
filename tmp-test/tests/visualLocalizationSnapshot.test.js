"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const en_1 = require("../src/shared/i18n/translations/en");
const de_1 = require("../src/shared/i18n/translations/de");
const snapshot = {
    en: {
        notificationsTitle: en_1.enTranslations.notificationsPanelTitle,
        markAll: en_1.enTranslations.notificationsMarkAllRead,
        accountTitle: en_1.enTranslations.tabAccount,
    },
    de: {
        notificationsTitle: de_1.deTranslations.notificationsPanelTitle,
        markAll: de_1.deTranslations.notificationsMarkAllRead,
        accountTitle: de_1.deTranslations.tabAccount,
    },
};
assert_1.default.deepStrictEqual(snapshot, {
    en: {
        notificationsTitle: 'Notifications',
        markAll: 'Mark all as read',
        accountTitle: 'Account',
    },
    de: {
        notificationsTitle: 'Benachrichtigungen',
        markAll: 'Alle als gelesen markieren',
        accountTitle: 'Konto',
    },
});
console.log('tests/visualLocalizationSnapshot.test.ts OK');
