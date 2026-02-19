"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const shiftMapping_1 = require("../src/features/shifts/shiftMapping");
const mapped = (0, shiftMapping_1.mapShiftRecord)({
    id: 'shift-100',
    shiftTitle: 'Lobby Shift',
    shiftLocation: 'Main Lobby',
    objectTitle: 'HQ Building',
    objectAddress: '10 Main St',
    shiftStartingDate: '2026-03-01T00:00:00Z',
    shiftStartingTime: '2026-03-01T08:00:00Z',
    shiftEndingDate: '2026-03-01T00:00:00Z',
    shiftEndingTime: '2026-03-01T16:00:00Z',
    shiftDescription: 'Front desk support',
    shiftStatus: 'in-progress',
});
assert_1.default.strictEqual(mapped.id, 'shift-100');
assert_1.default.strictEqual(mapped.title, 'Lobby Shift');
assert_1.default.strictEqual(mapped.location, 'Main Lobby');
assert_1.default.strictEqual(mapped.objectName, 'HQ Building');
assert_1.default.strictEqual(mapped.objectAddress, '10 Main St');
assert_1.default.strictEqual(mapped.start, '2026-03-01T08:00:00.000Z');
assert_1.default.strictEqual(mapped.end, '2026-03-01T16:00:00.000Z');
assert_1.default.strictEqual(mapped.description, 'Front desk support');
assert_1.default.strictEqual(mapped.status, 'in-progress');
const overnightMapped = (0, shiftMapping_1.mapShiftRecord)({
    id: 'shift-overnight',
    title: 'Night patrol',
    shiftStartingDate: '2026-03-01T00:00:00Z',
    shiftStartingTime: '2026-03-01T22:00:00Z',
    shiftEndingDate: '2026-03-01T00:00:00Z',
    shiftEndingTime: '2026-03-01T06:00:00Z',
    status: 'completed',
});
assert_1.default.strictEqual(overnightMapped.start, '2026-03-01T22:00:00.000Z');
assert_1.default.strictEqual(overnightMapped.end, '2026-03-02T06:00:00.000Z');
assert_1.default.strictEqual(overnightMapped.status, 'completed');
const fallbackMapped = (0, shiftMapping_1.mapShiftRecord)({ id: 'shift-fallback' });
assert_1.default.strictEqual(fallbackMapped.title, 'Shift');
assert_1.default.strictEqual(fallbackMapped.location, 'TBD');
assert_1.default.strictEqual(fallbackMapped.start, '2026-01-25T08:00:00Z');
assert_1.default.strictEqual(fallbackMapped.end, '2026-01-25T12:00:00.000Z');
assert_1.default.strictEqual(fallbackMapped.status, 'scheduled');
const sorted = (0, shiftMapping_1.sortShiftsByStart)([
    {
        ...mapped,
        id: 'b',
        start: '2026-03-03T08:00:00Z',
    },
    {
        ...mapped,
        id: 'a',
        start: '2026-03-01T08:00:00Z',
    },
]);
assert_1.default.deepStrictEqual(sorted.map((item) => item.id), ['a', 'b']);
const mappedArray = (0, shiftMapping_1.mapShiftArray)([
    {
        id: 'shift-1',
        title: 'First',
        start: '2026-03-02T08:00:00Z',
        end: '2026-03-02T12:00:00Z',
    },
    {
        id: 'shift-2',
        title: 'Second',
        start: '2026-03-01T08:00:00Z',
        end: '2026-03-01T12:00:00Z',
    },
    {
        id: 'shift-3',
        title: 'Hidden pending',
        start: '2026-03-03T08:00:00Z',
        end: '2026-03-03T12:00:00Z',
    },
    {
        id: 'shift-4',
        title: 'Hidden not published',
        start: '2026-03-04T08:00:00Z',
        end: '2026-03-04T12:00:00Z',
    },
    {
        id: '',
        title: 'Unknown id should be filtered',
        start: '2026-03-05T08:00:00Z',
        end: '2026-03-05T12:00:00Z',
    },
], [
    {
        assignmentId: 'a-1',
        shiftId: 'shift-1',
        confirmationStatus: 'confirmed',
        confirmedAt: '2026-03-02T07:00:00Z',
    },
    {
        assignmentId: 'a-2',
        shiftId: 'shift-2',
        confirmationStatus: 'published',
    },
    {
        assignmentId: 'a-3',
        shiftId: 'shift-3',
        confirmationStatus: 'pending',
    },
    {
        assignmentId: 'a-4',
        shiftId: 'shift-4',
        confirmationStatus: 'not_published',
    },
]);
assert_1.default.deepStrictEqual(mappedArray.map((item) => item.id), ['shift-2', 'shift-1']);
assert_1.default.strictEqual(mappedArray[0].confirmationStatus, 'published');
assert_1.default.strictEqual(mappedArray[1].confirmationStatus, 'confirmed');
assert_1.default.strictEqual(mappedArray[1].assignmentId, 'a-1');
assert_1.default.strictEqual(mappedArray[1].confirmedAt, '2026-03-02T07:00:00Z');
console.log('tests/shiftMapping.test.ts OK');
