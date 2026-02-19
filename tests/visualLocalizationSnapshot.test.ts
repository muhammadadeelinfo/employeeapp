import assert from 'assert';
import { enTranslations } from '../src/shared/i18n/translations/en';
import { deTranslations } from '../src/shared/i18n/translations/de';

const snapshot = {
  en: {
    notificationsTitle: enTranslations.notificationsPanelTitle,
    markAll: enTranslations.notificationsMarkAllRead,
    accountTitle: enTranslations.tabAccount,
  },
  de: {
    notificationsTitle: deTranslations.notificationsPanelTitle,
    markAll: deTranslations.notificationsMarkAllRead,
    accountTitle: deTranslations.tabAccount,
  },
};

assert.deepStrictEqual(snapshot, {
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
