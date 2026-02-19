"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const shiftNotificationPayload_1 = require("../src/shared/utils/shiftNotificationPayload");
const notificationUtils_1 = require("../src/shared/utils/notificationUtils");
const de_1 = require("../src/shared/i18n/translations/de");
const copy = {
    shiftPublished: de_1.deTranslations.notificationCategoryShiftPublished,
    shiftRemoved: de_1.deTranslations.notificationCategoryShiftRemoved,
    shiftScheduleChanged: de_1.deTranslations.notificationCategoryScheduleChanged,
    recentShiftUpdate: de_1.deTranslations.notificationRecentShiftUpdate,
};
const payload = (0, shiftNotificationPayload_1.buildShiftNotificationInsertPayload)('DELETE', 'shift-777', copy.recentShiftUpdate, copy);
assert_1.default.strictEqual(payload.title, 'Schicht entfernt');
assert_1.default.strictEqual((0, notificationUtils_1.determineNotificationCategory)(payload.title, payload.detail), 'shift-removed');
assert_1.default.strictEqual(payload.metadata.target, '/shift-details/shift-777');
console.log('tests/e2eNotificationRealtimeFlow.test.ts OK');
