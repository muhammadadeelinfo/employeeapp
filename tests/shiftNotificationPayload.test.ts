import assert from 'assert';
import { buildShiftNotificationInsertPayload } from '../src/shared/utils/shiftNotificationPayload';
import { enTranslations } from '../src/shared/i18n/translations/en';
import { deTranslations } from '../src/shared/i18n/translations/de';

const enCopy = {
  shiftPublished: enTranslations.notificationCategoryShiftPublished,
  shiftRemoved: enTranslations.notificationCategoryShiftRemoved,
  shiftScheduleChanged: enTranslations.notificationCategoryScheduleChanged,
  recentShiftUpdate: enTranslations.notificationRecentShiftUpdate,
};

const deCopy = {
  shiftPublished: deTranslations.notificationCategoryShiftPublished,
  shiftRemoved: deTranslations.notificationCategoryShiftRemoved,
  shiftScheduleChanged: deTranslations.notificationCategoryScheduleChanged,
  recentShiftUpdate: deTranslations.notificationRecentShiftUpdate,
};

const enPayload = buildShiftNotificationInsertPayload(
  'DELETE',
  'shift-123',
  enCopy.recentShiftUpdate,
  enCopy
);
assert.strictEqual(enPayload.title, 'Shift removed');
assert.strictEqual(enPayload.detail, 'Recent shift update');
assert.strictEqual(enPayload.metadata.target, '/shift-details/shift-123');
assert.strictEqual(enPayload.metadata.event, 'DELETE');

const dePayload = buildShiftNotificationInsertPayload(
  'UPDATE',
  'shift-9',
  deCopy.recentShiftUpdate,
  deCopy
);
assert.strictEqual(dePayload.title, 'Plan geändert');
assert.strictEqual(dePayload.detail, 'Aktuelles Schicht-Update');
assert.strictEqual(dePayload.metadata.target, '/shift-details/shift-9');
assert.strictEqual(dePayload.metadata.event, 'UPDATE');

console.log('tests/shiftNotificationPayload.test.ts OK');
