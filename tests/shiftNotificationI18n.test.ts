import assert from 'assert';
import { getShiftNotificationTitle } from '../src/shared/utils/shiftNotificationI18n';
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

assert.strictEqual(getShiftNotificationTitle('INSERT', enCopy), 'Shift published');
assert.strictEqual(getShiftNotificationTitle('DELETE', enCopy), 'Shift removed');
assert.strictEqual(getShiftNotificationTitle('UPDATE', enCopy), 'Schedule changed');

assert.strictEqual(getShiftNotificationTitle('INSERT', deCopy), 'Schicht veröffentlicht');
assert.strictEqual(getShiftNotificationTitle('DELETE', deCopy), 'Schicht entfernt');
assert.strictEqual(getShiftNotificationTitle('UPDATE', deCopy), 'Plan geändert');

assert.strictEqual(enCopy.recentShiftUpdate, 'Recent shift update');
assert.strictEqual(deCopy.recentShiftUpdate, 'Aktuelles Schicht-Update');

console.log('tests/shiftNotificationI18n.test.ts OK');
