"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const shiftNotificationPayload_1 = require("../src/shared/utils/shiftNotificationPayload");
const en_1 = require("../src/shared/i18n/translations/en");
const de_1 = require("../src/shared/i18n/translations/de");
const enCopy = {
    shiftPublished: en_1.enTranslations.notificationCategoryShiftPublished,
    shiftRemoved: en_1.enTranslations.notificationCategoryShiftRemoved,
    shiftScheduleChanged: en_1.enTranslations.notificationCategoryScheduleChanged,
    recentShiftUpdate: en_1.enTranslations.notificationRecentShiftUpdate,
};
const deCopy = {
    shiftPublished: de_1.deTranslations.notificationCategoryShiftPublished,
    shiftRemoved: de_1.deTranslations.notificationCategoryShiftRemoved,
    shiftScheduleChanged: de_1.deTranslations.notificationCategoryScheduleChanged,
    recentShiftUpdate: de_1.deTranslations.notificationRecentShiftUpdate,
};
const enPayload = (0, shiftNotificationPayload_1.buildShiftNotificationInsertPayload)('DELETE', 'shift-123', enCopy.recentShiftUpdate, enCopy);
assert_1.default.strictEqual(enPayload.title, 'Shift removed');
assert_1.default.strictEqual(enPayload.detail, 'Recent shift update');
assert_1.default.strictEqual(enPayload.metadata.target, '/shift-details/shift-123');
assert_1.default.strictEqual(enPayload.metadata.event, 'DELETE');
const dePayload = (0, shiftNotificationPayload_1.buildShiftNotificationInsertPayload)('UPDATE', 'shift-9', deCopy.recentShiftUpdate, deCopy);
assert_1.default.strictEqual(dePayload.title, 'Plan geändert');
assert_1.default.strictEqual(dePayload.detail, 'Aktuelles Schicht-Update');
assert_1.default.strictEqual(dePayload.metadata.target, '/shift-details/shift-9');
assert_1.default.strictEqual(dePayload.metadata.event, 'UPDATE');
console.log('tests/shiftNotificationPayload.test.ts OK');
