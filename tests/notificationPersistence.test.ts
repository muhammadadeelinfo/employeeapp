import assert from 'assert';
import { persistNotificationRow } from '../src/shared/utils/notificationPersistence';
import { buildShiftNotificationInsertPayload } from '../src/shared/utils/shiftNotificationPayload';
import { deTranslations } from '../src/shared/i18n/translations/de';

const inserted: any[] = [];
const mockClient = {
  from: (table: string) => {
    assert.strictEqual(table, 'notifications');
    return {
      insert: async (row: any) => {
        inserted.push(row);
        return { error: null };
      },
    };
  },
};

const copy = {
  shiftPublished: deTranslations.notificationCategoryShiftPublished,
  shiftRemoved: deTranslations.notificationCategoryShiftRemoved,
  shiftScheduleChanged: deTranslations.notificationCategoryScheduleChanged,
  recentShiftUpdate: deTranslations.notificationRecentShiftUpdate,
};

const payload = buildShiftNotificationInsertPayload(
  'DELETE',
  'shift-55',
  copy.recentShiftUpdate,
  copy
);

void persistNotificationRow(mockClient, 'employee-1', payload)
  .then(() => {
    assert.strictEqual(inserted.length, 1);
    assert.deepStrictEqual(inserted[0], {
      employee_id: 'employee-1',
      title: 'Schicht entfernt',
      detail: 'Aktuelles Schicht-Update',
      metadata: {
        shiftId: 'shift-55',
        target: '/shift-details/shift-55',
        event: 'DELETE',
      },
    });
    console.log('tests/notificationPersistence.test.ts OK');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
