"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const notificationPersistence_1 = require("../src/shared/utils/notificationPersistence");
const shiftNotificationPayload_1 = require("../src/shared/utils/shiftNotificationPayload");
const de_1 = require("../src/shared/i18n/translations/de");
const inserted = [];
const mockClient = {
    from: (table) => {
        assert_1.default.strictEqual(table, 'notifications');
        return {
            insert: async (row) => {
                inserted.push(row);
                return { error: null };
            },
        };
    },
};
const copy = {
    shiftPublished: de_1.deTranslations.notificationCategoryShiftPublished,
    shiftRemoved: de_1.deTranslations.notificationCategoryShiftRemoved,
    shiftScheduleChanged: de_1.deTranslations.notificationCategoryScheduleChanged,
    recentShiftUpdate: de_1.deTranslations.notificationRecentShiftUpdate,
};
const payload = (0, shiftNotificationPayload_1.buildShiftNotificationInsertPayload)('DELETE', 'shift-55', copy.recentShiftUpdate, copy);
void (0, notificationPersistence_1.persistNotificationRow)(mockClient, 'employee-1', payload)
    .then(() => {
    assert_1.default.strictEqual(inserted.length, 1);
    assert_1.default.deepStrictEqual(inserted[0], {
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
