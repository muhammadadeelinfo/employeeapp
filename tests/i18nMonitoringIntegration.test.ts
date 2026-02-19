import assert from 'assert';
import {
  createMissingTranslationLogger,
  getTranslationValue,
  initializeMissingTranslationMonitoring,
  setMissingTranslationHandler,
} from '../src/shared/utils/i18nUtils';

const messages: string[] = [];
const logger = (message: string) => messages.push(message);

const logHandler = createMissingTranslationLogger(logger);
logHandler({ key: 'demo_key', reason: 'missing' });
assert.strictEqual(
  messages[0],
  '[i18n] Missing translation (missing): demo_key'
);

initializeMissingTranslationMonitoring(logger);
const dictionary = { known: 'Known value' };
assert.strictEqual(getTranslationValue(dictionary, 'unknown_key'), 'unknown_key');
assert.strictEqual(messages.length, 2);
assert.strictEqual(
  messages[1],
  '[i18n] Missing translation (missing): unknown_key'
);

setMissingTranslationHandler(null);

console.log('tests/i18nMonitoringIntegration.test.ts OK');
