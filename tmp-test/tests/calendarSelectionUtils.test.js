"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const calendarSelectionUtils_1 = require("../src/shared/utils/calendarSelectionUtils");
const calA = { id: 'a', title: 'Personal' };
const calB = { id: 'b', title: 'Team', sourceName: 'Google' };
assert_1.default.deepStrictEqual((0, calendarSelectionUtils_1.toggleCalendarSelectionInList)([], calA), [calA]);
assert_1.default.deepStrictEqual((0, calendarSelectionUtils_1.toggleCalendarSelectionInList)([calA], calA), []);
assert_1.default.deepStrictEqual((0, calendarSelectionUtils_1.toggleCalendarSelectionInList)([calA], calB), [calA, calB]);
assert_1.default.deepStrictEqual((0, calendarSelectionUtils_1.parseStoredCalendarSelection)(null), []);
assert_1.default.deepStrictEqual((0, calendarSelectionUtils_1.parseStoredCalendarSelection)(''), []);
assert_1.default.deepStrictEqual((0, calendarSelectionUtils_1.parseStoredCalendarSelection)('not-json'), []);
assert_1.default.deepStrictEqual((0, calendarSelectionUtils_1.parseStoredCalendarSelection)('{"id":"x"}'), []);
assert_1.default.deepStrictEqual((0, calendarSelectionUtils_1.parseStoredCalendarSelection)(JSON.stringify([
    calA,
    calB,
    { id: 'bad-1' },
    { title: 'bad-2' },
    { id: 1, title: 'bad-3' },
])), [calA, calB]);
console.log('tests/calendarSelectionUtils.test.ts OK');
