import assert from 'assert';
import { interpolate } from '../src/shared/utils/languageUtils';
import { enTranslations } from '../src/shared/i18n/translations/en';
import { deTranslations } from '../src/shared/i18n/translations/de';

type SupportedLanguage = 'en' | 'de';

const translations = {
  en: enTranslations,
  de: deTranslations,
} as const;

const translate = <T extends keyof typeof enTranslations>(
  language: SupportedLanguage,
  key: T,
  vars?: Record<string, string | number>
) => interpolate(translations[language][key], vars);

assert.strictEqual(translate('en', 'notificationsPanelTitle'), 'Notifications');
assert.strictEqual(translate('de', 'notificationsPanelTitle'), 'Benachrichtigungen');

assert.strictEqual(translate('en', 'securityResetLinkSent', { email: 'a@b.com' }), 'Password reset link sent to a@b.com.');
assert.strictEqual(
  translate('de', 'securityResetLinkSent', { email: 'a@b.com' }),
  'Link zum Zurücksetzen des Passworts wurde an a@b.com gesendet.'
);

assert.strictEqual(
  translate('en', 'notificationsPanelWaiting', { count: 4 }),
  '4 waiting'
);
assert.strictEqual(
  translate('de', 'notificationsPanelWaiting', { count: 4 }),
  '4 offen'
);

console.log('tests/i18nInterpolation.test.ts OK');
