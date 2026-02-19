"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const i18nUtils_1 = require("../src/shared/utils/i18nUtils");
const messages = [];
const logger = (message) => messages.push(message);
const logHandler = (0, i18nUtils_1.createMissingTranslationLogger)(logger);
logHandler({ key: 'demo_key', reason: 'missing' });
assert_1.default.strictEqual(messages[0], '[i18n] Missing translation (missing): demo_key');
(0, i18nUtils_1.initializeMissingTranslationMonitoring)(logger);
const dictionary = { known: 'Known value' };
assert_1.default.strictEqual((0, i18nUtils_1.getTranslationValue)(dictionary, 'unknown_key'), 'unknown_key');
assert_1.default.strictEqual(messages.length, 2);
assert_1.default.strictEqual(messages[1], '[i18n] Missing translation (missing): unknown_key');
(0, i18nUtils_1.setMissingTranslationHandler)(null);
console.log('tests/i18nMonitoringIntegration.test.ts OK');
