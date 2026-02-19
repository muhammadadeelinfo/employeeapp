import assert from 'assert';
import {
  getContentMaxWidth,
  shouldStackForCompactWidth,
} from '../src/shared/utils/responsiveLayout';

const snapshot = [360, 393, 430, 768, 1024, 1366].map((width) => ({
  width,
  stack: shouldStackForCompactWidth(width),
  maxWidth: getContentMaxWidth(width) ?? null,
}));

assert.deepStrictEqual(snapshot, [
  { width: 360, stack: true, maxWidth: null },
  { width: 393, stack: true, maxWidth: null },
  { width: 430, stack: false, maxWidth: null },
  { width: 768, stack: false, maxWidth: 820 },
  { width: 1024, stack: false, maxWidth: 820 },
  { width: 1366, stack: false, maxWidth: 960 },
]);

console.log('tests/visualResponsiveSnapshot.test.ts OK');
