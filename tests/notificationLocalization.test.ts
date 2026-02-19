import assert from 'assert';
import {
  notificationCategoryLabelKeys,
  type NotificationCategory,
} from '../src/shared/utils/notificationUtils';
import { enTranslations } from '../src/shared/i18n/translations/en';
import { deTranslations } from '../src/shared/i18n/translations/de';

const categories: NotificationCategory[] = [
  'shift-published',
  'shift-removed',
  'shift-schedule',
  'admin',
  'general',
];

categories.forEach((category) => {
  const labelKey = notificationCategoryLabelKeys[category];
  assert.ok(labelKey, `Missing label key for category: ${category}`);
  assert.ok(labelKey in enTranslations, `Label key missing in EN dictionary: ${labelKey}`);
  assert.ok(labelKey in deTranslations, `Label key missing in DE dictionary: ${labelKey}`);
  assert.strictEqual(typeof enTranslations[labelKey], 'string');
  assert.strictEqual(typeof deTranslations[labelKey], 'string');
});

console.log('tests/notificationLocalization.test.ts OK');
