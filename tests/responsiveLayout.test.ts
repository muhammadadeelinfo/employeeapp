import assert from 'assert';
import {
  getContentMaxWidth,
  shouldStackForCompactWidth,
} from '../src/shared/utils/responsiveLayout';

assert.strictEqual(shouldStackForCompactWidth(393), true);
assert.strictEqual(shouldStackForCompactWidth(429), true);
assert.strictEqual(shouldStackForCompactWidth(430), false);

assert.strictEqual(getContentMaxWidth(393), undefined);
assert.strictEqual(getContentMaxWidth(767), undefined);
assert.strictEqual(getContentMaxWidth(768), 820);
assert.strictEqual(getContentMaxWidth(1024), 820);
assert.strictEqual(getContentMaxWidth(1200), 960);
assert.strictEqual(getContentMaxWidth(1440), 960);

console.log('tests/responsiveLayout.test.ts OK');
