"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const shiftNotificationI18n_1 = require("../src/shared/utils/shiftNotificationI18n");
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
assert_1.default.strictEqual((0, shiftNotificationI18n_1.getShiftNotificationTitle)('INSERT', enCopy), 'Shift published');
assert_1.default.strictEqual((0, shiftNotificationI18n_1.getShiftNotificationTitle)('DELETE', enCopy), 'Shift removed');
assert_1.default.strictEqual((0, shiftNotificationI18n_1.getShiftNotificationTitle)('UPDATE', enCopy), 'Schedule changed');
assert_1.default.strictEqual((0, shiftNotificationI18n_1.getShiftNotificationTitle)('INSERT', deCopy), 'Schicht veröffentlicht');
assert_1.default.strictEqual((0, shiftNotificationI18n_1.getShiftNotificationTitle)('DELETE', deCopy), 'Schicht entfernt');
assert_1.default.strictEqual((0, shiftNotificationI18n_1.getShiftNotificationTitle)('UPDATE', deCopy), 'Plan geändert');
assert_1.default.strictEqual(enCopy.recentShiftUpdate, 'Recent shift update');
assert_1.default.strictEqual(deCopy.recentShiftUpdate, 'Aktuelles Schicht-Update');
console.log('tests/shiftNotificationI18n.test.ts OK');
