import assert from 'assert';
import { buildShiftNotificationInsertPayload } from '../src/shared/utils/shiftNotificationPayload';
import { determineNotificationCategory } from '../src/shared/utils/notificationUtils';
import { deTranslations } from '../src/shared/i18n/translations/de';

const copy = {
  shiftPublished: deTranslations.notificationCategoryShiftPublished,
  shiftRemoved: deTranslations.notificationCategoryShiftRemoved,
  shiftScheduleChanged: deTranslations.notificationCategoryScheduleChanged,
  recentShiftUpdate: deTranslations.notificationRecentShiftUpdate,
};

const payload = buildShiftNotificationInsertPayload(
  'DELETE',
  'shift-777',
  copy.recentShiftUpdate,
  copy
);

assert.strictEqual(payload.title, 'Schicht entfernt');
assert.strictEqual(determineNotificationCategory(payload.title, payload.detail), 'shift-removed');
assert.strictEqual(payload.metadata.target, '/shift-details/shift-777');

console.log('tests/e2eNotificationRealtimeFlow.test.ts OK');
