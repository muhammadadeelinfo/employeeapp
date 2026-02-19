import assert from 'assert';
import { getNotificationsSummaryTranslationKey } from '../src/shared/utils/notificationsViewModel';
import { interpolate } from '../src/shared/utils/languageUtils';
import { enTranslations } from '../src/shared/i18n/translations/en';
import { deTranslations } from '../src/shared/i18n/translations/de';

const renderSummary = (
  language: 'en' | 'de',
  unreadCount: number
) => {
  const dict = language === 'en' ? enTranslations : deTranslations;
  const key = getNotificationsSummaryTranslationKey(unreadCount);
  return interpolate(dict[key], { count: unreadCount });
};

assert.strictEqual(renderSummary('en', 3), '3 waiting');
assert.strictEqual(renderSummary('de', 3), '3 offen');
assert.strictEqual(renderSummary('en', 0), 'All caught up');
assert.strictEqual(renderSummary('de', 0), 'Alles erledigt');

console.log('tests/uiNotificationsIntegration.test.ts OK');
