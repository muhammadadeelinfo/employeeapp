import assert from 'assert';
import { ensureShiftEndAfterStart } from '../src/shared/utils/timeUtils';

type TestCase = {
  name: string;
  start: string;
  end: string;
  expectedEnd: string;
};

const testCases: TestCase[] = [
  {
    name: 'same-day end',
    start: '2026-01-26T08:00:00Z',
    end: '2026-01-26T16:00:00Z',
    expectedEnd: '2026-01-26T16:00:00.000Z',
  },
  {
    name: 'overnight end',
    start: '2026-01-26T18:00:00Z',
    end: '2026-01-26T06:00:00Z',
    expectedEnd: '2026-01-27T06:00:00.000Z',
  },
  {
    name: 'already next day',
    start: '2026-01-26T18:00:00Z',
    end: '2026-01-27T02:00:00Z',
    expectedEnd: '2026-01-27T02:00:00.000Z',
  },
  {
    name: 'invalid start',
    start: 'invalid',
    end: '2026-01-27T02:00:00Z',
    expectedEnd: '2026-01-27T02:00:00Z',
  },
  {
    name: 'invalid end',
    start: '2026-01-26T18:00:00Z',
    end: 'invalid',
    expectedEnd: 'invalid',
  },
  {
    name: 'equal start and end rolls to next day',
    start: '2026-01-26T18:00:00Z',
    end: '2026-01-26T18:00:00Z',
    expectedEnd: '2026-01-27T18:00:00.000Z',
  },
];

testCases.forEach((test) => {
  const actual = ensureShiftEndAfterStart(test.start, test.end);
  assert.strictEqual(
    actual,
    test.expectedEnd,
    `${test.name}: expected ${test.expectedEnd} but got ${actual}`
  );
});

console.log('tests/timeUtils.test.ts OK');
